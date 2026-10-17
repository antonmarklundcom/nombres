<?php
declare(strict_types=1);
if (PHP_SAPI!=='cli') { http_response_code(404);exit; }
require __DIR__.'/../lib/catalog.php';
require __DIR__.'/../lib/storage.php';
const DB_COLUMNS=['slug','name','gender','origin','meaning','note','context','native_form','saint','tags_json','variants_json','review_json','compare_json'];
function record_values(array $n): array {
    $values=[];
    foreach (DB_COLUMNS as $column) {
        if (str_ends_with($column,'_json')) {
            $key=substr($column,0,-5);
            $values[]=isset($n[$key])?json_encode($n[$key],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR):null;
        } else $values[]=$n[$column]??null;
    }
    return $values;
}
function require_valid(array $names): void {
    $errors=catalog_errors($names);
    if ($errors) throw new RuntimeException('Catalog validation failed: '.implode('; ',array_slice($errors,0,5)));
}
function upsert_records(PDO $pdo,array $names): void {
    $cols=implode(',',DB_COLUMNS);
    $updates=implode(',',array_map(static fn($c)=>"$c=VALUES($c)",array_slice(DB_COLUMNS,1)));
    $query=$pdo->prepare('INSERT INTO nombres_names ('.$cols.') VALUES ('.implode(',',array_fill(0,count(DB_COLUMNS),'?')).') ON DUPLICATE KEY UPDATE '.$updates);
    $pdo->beginTransaction();
    try {
        foreach ($names as $n) $query->execute(record_values($n));
        $pdo->commit();
    } catch (Throwable $e) { $pdo->rollBack();throw $e; }
}
try {
    $command=$argv[1]??'help';
    $fileNames=require __DIR__.'/../content/names.php';
    if ($command==='sql-export') {
        require_valid($fileNames);
        echo file_get_contents(__DIR__.'/../database/schema.sql')."\n";
        echo "SET @nombres_previous_sql_mode=@@SESSION.sql_mode;\nSET SESSION sql_mode='STRICT_TRANS_TABLES,NO_BACKSLASH_ESCAPES';\nSTART TRANSACTION;\n";
        foreach ($fileNames as $n) {
            $values=array_map(static fn($v)=>$v===null?'NULL':"'".str_replace("'","''",(string)$v)."'",record_values($n));
            echo 'INSERT INTO nombres_names ('.implode(',',DB_COLUMNS).') VALUES ('.implode(',',$values).') ON DUPLICATE KEY UPDATE '.implode(',',array_map(static fn($c)=>"$c=VALUES($c)",array_slice(DB_COLUMNS,1))).";\n";
        }
        echo "COMMIT;\nSET SESSION sql_mode=@nombres_previous_sql_mode;\n";
        exit;
    }
    if (!in_array($command,['check','install','seed','export','snapshot','upsert'],true)) {
        echo "Commands: sql-export | check | install | seed [--write] | export | snapshot | upsert records.json [--write]\n";exit;
    }
    $config=runtime_config();$pdo=database_connection($config);
    if ($command==='install') {
        $schema=file_get_contents(__DIR__.'/../database/schema.sql');
        foreach (explode(';',$schema) as $statement) if (trim($statement)!=='') $pdo->exec($statement);
        echo "PASS: schema installed; no application data deleted\n";exit;
    }
    if ($command==='seed') {
        require_valid($fileNames);
        if (!in_array('--write',$argv,true)) { echo 'DRY RUN: '.count($fileNames)." records validated; --write imports/updates matching slugs without deleting other rows.\n";exit; }
        upsert_records($pdo,$fileNames);invalidate_catalog_cache($config);
        echo 'PASS: imported '.count($fileNames)." records; other slugs retained\n";exit;
    }
    $names=database_catalog($pdo);
    if ($command==='upsert') {
        $path=$argv[2]??'';
        if (!is_file($path)) throw new RuntimeException('Provide a JSON array of complete records.');
        $incoming=json_decode((string)file_get_contents($path),true,64,JSON_THROW_ON_ERROR);
        if (!is_array($incoming)||!array_is_list($incoming)) throw new RuntimeException('Input must be an array.');
        if (catalog_errors($incoming,false)) throw new RuntimeException('Incoming records failed validation.');
        $merged=[];foreach ($names as $n) $merged[$n['slug']]=$n;
        foreach ($incoming as $n) { if (!is_array($n)||!isset($n['slug'])||!is_string($n['slug'])) throw new RuntimeException('Record slug required.');$merged[$n['slug']]=$n; }
        require_valid(array_values($merged));
        if (!in_array('--write',$argv,true)) { echo "DRY RUN: valid; add --write to update the database.\n";exit; }
        upsert_records($pdo,$incoming);invalidate_catalog_cache($config);echo "PASS: database updated; cache invalidated\n";exit;
    }
    if ($command==='export') { echo json_encode($names,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR)."\n";exit; }
    if ($command==='snapshot') { write_catalog_cache($config,$names);echo "PASS: validated public catalog snapshot refreshed\n";exit; }
    $version=$pdo->query("SELECT meta_value FROM nombres_meta WHERE meta_key='schema_version'")->fetchColumn();
    if ($version!=='1') throw new RuntimeException('Unexpected schema version.');
    echo 'PASS: MySQL connected, schema version 1, '.count($names)." valid records; no credentials printed\n";
} catch (Throwable $e) {
    // PDO exceptions often contain host/user names. Do not echo connection details.
    fwrite(STDERR,$e instanceof PDOException ? "Database operation failed. Check the private config, database permissions and schema; credentials are not printed.\n" : $e->getMessage()."\n");exit(1);
}
