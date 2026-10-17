"""Real MySQL/MariaDB integration test; never targets a production hostname.

NOMBRES_TEST_CONFIG_FILE=/private/local-test-config.php python tests/database_workflow.py
Or set NOMBRES_TEST_MYSQL_PASSWORD for the localhost CI test database.
The only accepted database is nombres_test on localhost/127.0.0.1.
"""
import json,os,pathlib,subprocess,tempfile,urllib.request,time,socket
root=pathlib.Path(__file__).resolve().parents[1]
def php_quote(s):return "'"+str(s).replace('\\','\\\\').replace("'","\\'")+"'"
with tempfile.TemporaryDirectory(prefix='nombres-db-integration-') as tmp:
    tmp=pathlib.Path(tmp)
    supplied=os.environ.get('NOMBRES_TEST_CONFIG_FILE')
    if supplied:
        # Read only non-secret guard data through PHP; never dump credentials.
        guard=subprocess.check_output(['php','-r',"$c=require $argv[1]; echo json_encode(['host'=>$c['db']['host'],'name'=>$c['db']['name']]);",supplied],text=True)
        assert json.loads(guard)['host'] in ['localhost','127.0.0.1'] and json.loads(guard)['name']=='nombres_test','Only isolated local test DB is allowed'
        config=tmp/'config.php'
        config.write_text("<?php $c=require "+php_quote(supplied)+"; $c['storage']='mysql'; $c['cache_dir']="+php_quote(str(tmp/'cache'))+"; $c['diagnostics']=true; return $c;\n")
    else:
        pwd=os.environ.get('NOMBRES_TEST_MYSQL_PASSWORD')
        if pwd is None:raise SystemExit('NOT RUN: provide an isolated local MySQL test configuration')
        cfg={'storage':'mysql','diagnostics':True,'cache_dir':str(tmp/'cache'),'cache_ttl':60,'db':{'host':'127.0.0.1','port':int(os.environ.get('NOMBRES_TEST_MYSQL_PORT','3306')),'name':'nombres_test','user':os.environ.get('NOMBRES_TEST_MYSQL_USER','root'),'password':pwd}}
        config=tmp/'config.php';config.write_text('<?php return json_decode('+php_quote(json.dumps(cfg))+',true);\n')
    config.chmod(0o600)
    env=os.environ.copy();env['NOMBRES_CONFIG_FILE']=str(config)
    def command(*args,success=True):
        r=subprocess.run(['php',str(root/'tools/database.php'),*args],env=env,cwd=root,capture_output=True,text=True)
        assert (r.returncode==0)==success,(args,r.stdout,r.stderr)
        return r.stdout
    def evaluate(code,success=True,extra_env=None):
        script='require '+php_quote(str(root/'lib/catalog.php'))+';require '+php_quote(str(root/'lib/storage.php'))+';'+code
        r=subprocess.run(['php','-r',script],env=extra_env or env,cwd=root,capture_output=True,text=True)
        assert (r.returncode==0)==success,(r.stdout,r.stderr)
        return r.stdout
    command('install');command('install');command('seed','--write');command('seed','--write')
    baseline=json.loads(subprocess.check_output(['php',str(root/'tools/names.php'),'export'],text=True))
    assert json.loads(command('export'))==baseline,'SQL seed round-trip preserves all fields and Unicode'
    command('check')
    # Execute the actual phpMyAdmin SQL artifact, including quotes/backslashes and JSON.
    dump=tmp/'catalog.sql';dump.write_text(command('sql-export'))
    evaluate('$p=database_connection(runtime_config());$p->setAttribute(PDO::ATTR_EMULATE_PREPARES,true);$s=$p->query(file_get_contents('+php_quote(str(dump))+')); do {if ($s->columnCount()) $s->fetchAll();} while ($s->nextRowset());')
    assert json.loads(command('export'))==baseline,'SQL artifact round-trip'
    command('snapshot')
    chosen=dict(next(n for n in baseline if n['slug']=='jasy'))
    chosen['note']="Prueba SQL: ñ, ã, ë, apóstrofo ' y barra \\ conservados."
    update=tmp/'update.json';update.write_text(json.dumps([chosen],ensure_ascii=False))
    command('upsert',str(update))
    assert json.loads(command('export'))==baseline,'SQL dry run must not write'
    command('upsert',str(update),'--write')
    assert evaluate('echo is_file(catalog_cache_file(runtime_config()))?"stale":"invalidated";')=='invalidated'
    assert next(n for n in json.loads(command('export')) if n['slug']=='jasy')['note']==chosen['note'],'Prepared upsert preserves quotes and Unicode'
    bad=dict(chosen,compare=['missing-target']);update.write_text(json.dumps([bad]));command('upsert',str(update),'--write',success=False)
    evaluate('$c=runtime_config();$n=load_public_catalog($c);echo count($n);')
    # Force an outage without touching the real test server, then verify stale-cache and file fallbacks.
    broken=tmp/'broken.php';broken.write_text('<?php $c=require '+php_quote(str(config))+"; $c['cache_ttl']=0;$c['db']['socket']='/tmp/nombres-socket-does-not-exist';return $c;\n")
    broken.chmod(0o600);bad_env=env.copy();bad_env['NOMBRES_CONFIG_FILE']=str(broken)
    status=evaluate('$c=runtime_config();$n=load_public_catalog($c);echo $catalogStorageStatus.":".count($n);',extra_env=bad_env)
    assert status=='mysql-stale-cache:'+str(len(baseline)),status
    evaluate('invalidate_catalog_cache(runtime_config());')
    status=evaluate('$n=load_public_catalog(runtime_config());echo $catalogStorageStatus.":".count($n);',extra_env=bad_env)
    assert status=='file-fallback:'+str(len(baseline)),status
    command('seed','--write');command('snapshot')
    # A manual phpMyAdmin mistake must not become a broken public page.
    invalid_review={'status':'qualified','sources':[{'title':'Source','url':'https://example.com/','checked':'2026-10-17','scope':[]}]}
    invalid_json=json.dumps(invalid_review)
    evaluate('$p=database_connection(runtime_config());$q=$p->prepare("UPDATE nombres_names SET review_json=? WHERE slug=\'jasy\'");$q->execute(['+php_quote(invalid_json)+']);')
    command('check',success=False)
    assert evaluate('$c=runtime_config();$c["cache_ttl"]=0;$n=load_public_catalog($c);echo $catalogStorageStatus;')=='mysql-stale-cache','Invalid SQL editorial fields must use the last valid snapshot'
    command('seed','--write');command('snapshot')
    # Public HTTP runs against the SQL mode; diagnostics reveal no credentials.
    s=socket.socket();s.bind(('127.0.0.1',0));port=s.getsockname()[1];s.close()
    log=(tmp/'server.log').open('w')
    process=subprocess.Popen(['php','-S',f'127.0.0.1:{port}','router.php'],cwd=root,env=env,stdout=log,stderr=log)
    try:
        for _ in range(50):
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{port}/',timeout=1) as r:assert r.status==200
                break
            except OSError:time.sleep(.1)
        else:raise AssertionError('SQL HTTP server did not become ready')
        before=int(evaluate('$p=database_connection(runtime_config());echo $p->query("SHOW GLOBAL STATUS LIKE \'Com_select\'")->fetch(PDO::FETCH_NUM)[1];'))
        for _ in range(12):
            with urllib.request.urlopen(f'http://127.0.0.1:{port}/nombre/jasy/') as r:
                assert r.headers.get('X-Nombres-Storage')=='mysql-cache'
                assert 'Luna; también mes'.encode() in r.read()
        after=int(evaluate('$p=database_connection(runtime_config());echo $p->query("SHOW GLOBAL STATUS LIKE \'Com_select\'")->fetch(PDO::FETCH_NUM)[1];'))
        assert after==before,'Warm public requests must not perform additional SQL SELECTs'
        base=f'http://127.0.0.1:{port}'
        with urllib.request.urlopen(base+'/assets/names.json') as r:old_etag=r.headers['ETag']
        edited=dict(chosen,meaning=chosen['meaning']+' Prueba temporal de edición.')
        update.write_text(json.dumps([edited],ensure_ascii=False));command('upsert',str(update),'--write')
        with urllib.request.urlopen(urllib.request.Request(base+'/assets/names.json',headers={'If-None-Match':old_etag})) as r:
            new_etag=r.headers['ETag'];assert new_etag!=old_etag
            assert next(n for n in json.loads(r.read())['n'] if n[0]=='jasy')[4]==edited['meaning']
        try:urllib.request.urlopen(urllib.request.Request(base+'/assets/names.json',headers={'If-None-Match':new_etag}))
        except urllib.error.HTTPError as r:assert r.code==304 and r.read()==b''
        else:raise AssertionError('Matching name-catalog ETag should produce 304')
        command('seed','--write')
        subprocess.run(['python3',str(root/'tests/crawl.py'),'--base',f'http://127.0.0.1:{port}','--root',str(root)],check=True,env=env)
    finally:process.terminate();process.wait(timeout=10);log.close()
    print('PASS: real SQL schema, idempotent seed, full Unicode/JSON round-trip, phpMyAdmin artifact, dry run/upsert, cache invalidation, outage fallbacks, zero warm SELECTs and full SQL HTTP crawl')
