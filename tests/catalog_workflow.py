"""Exercise the real editing CLI in a disposable checkout copy."""
import hashlib,json,pathlib,shutil,subprocess,tempfile
root=pathlib.Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='nombres-catalog-') as tmp:
    target=pathlib.Path(tmp)/'site'
    shutil.copytree(root,target,ignore=shutil.ignore_patterns('.git','dist','screenshots','qa','__pycache__'))
    def run(*args,success=True):
        r=subprocess.run(['php','tools/names.php',*args],cwd=target,text=True,capture_output=True)
        assert (r.returncode==0)==success,(args,r.stdout,r.stderr)
        return r
    records=json.loads(run('export').stdout)
    file=target/'content/names.php'
    original=file.read_bytes()
    selected=next(n for n in records if n['slug']=='mateo')
    selected['note']='Prueba editorial de actualización, sólo en la copia temporal.'
    entry=pathlib.Path(tmp)/'upsert.json';entry.write_text(json.dumps([selected],ensure_ascii=False))
    run('upsert',str(entry));assert file.read_bytes()==original,'Dry run must not write'
    run('upsert',str(entry),'--write');run('validate')
    updated=json.loads(run('export').stdout)
    assert next(n for n in updated if n['slug']=='mateo')['note']==selected['note']
    first=file.read_bytes();run('upsert',str(entry),'--write');assert file.read_bytes()==first,'Repeat upsert must be idempotent'
    new=dict(selected,slug='nombre-de-prueba',name='Nombre de Prueba',gender='u',tags=['compuesto','unisex'])
    new.pop('saint',None)
    entry.write_text(json.dumps([new]));run('upsert',str(entry),'--write');run('validate')
    route=subprocess.check_output(['php','tools/routes.php'],cwd=target,text=True)
    assert '/nombre/nombre-de-prueba/' in json.loads(route)['indexable'],'New name creates its route and sitemap membership'
    for bad in [dict(new,slug='../escape'),dict(new,name='Mateo'),dict(new,tags=['invalid']),dict(new,meaning='<script>bad</script>'),dict(new,context='<script>bad</script>'),dict(new,compare=['does-not-exist']),dict(new,review={'status':'verified','sources':[]}),dict(new,saint=['invalid']),dict(new,review={'status':'qualified','sources':[{'title':'Source','url':'https://example.com/','checked':'2026-10-17','scope':[]}]}),dict(new,review={'status':'qualified','sources':[{'title':'Source','url':'https://example.com/','checked':'2026-02-31'}]})]:
        entry.write_text(json.dumps([bad]));before=file.read_bytes();run('upsert',str(entry),'--write',success=False);assert file.read_bytes()==before,'Invalid input must not mutate data'
    entry.write_text('{bad json');run('upsert',str(entry),success=False)
print('PASS: catalog export, dry run, update, add, route inclusion, repeatability and rejected invalid imports')
