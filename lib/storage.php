<?php
declare(strict_types=1);

function default_runtime_config(): array {
    return ['storage'=>'file', 'diagnostics'=>false, 'cache_ttl'=>60, 'cache_dir'=>dirname(__DIR__,2).'/nombres-cache',
        'db'=>['host'=>'localhost','port'=>3306,'socket'=>'','name'=>'','user'=>'','password'=>'']];
}
function runtime_config(): array {
    $defaults=default_runtime_config();
    $explicit=getenv('NOMBRES_CONFIG_FILE');
    $paths=$explicit!==false && $explicit!=='' ? [$explicit] : [dirname(__DIR__,2).'/nombres-config.php',__DIR__.'/../config.local.php'];
    foreach ($paths as $path) {
        if (!is_file($path)) { if ($explicit) throw new RuntimeException('Private configuration file is unavailable.'); continue; }
        $config=require $path;
        if (!is_array($config)) throw new RuntimeException('Private configuration must return an array.');
        $config=array_replace_recursive($defaults,$config);
        if (!in_array($config['storage'],['file','mysql'],true)) throw new RuntimeException('Storage must be file or mysql.');
        $config['cache_ttl']=max(0,min(3600,(int)$config['cache_ttl']));
        return $config;
    }
    return $defaults;
}
function database_connection(array $config): PDO {
    if (!class_exists(PDO::class) || !in_array('mysql',PDO::getAvailableDrivers(),true)) throw new RuntimeException('Enable PDO MySQL in PHP first.');
    $db=$config['db'];
    if (!preg_match('/^[a-zA-Z0-9.-]+$/D',(string)$db['host']) || !preg_match('/^[a-zA-Z0-9_]+$/D',(string)$db['name']) || (string)$db['user']==='') throw new RuntimeException('Database host, name and user must be configured.');
    $port=(int)$db['port'];
    if ($port<1 || $port>65535) throw new RuntimeException('Invalid database port.');
    $address='host='.$db['host'].';port='.$port;
    if (!empty($db['socket'])) {
        if (!is_string($db['socket']) || !str_starts_with($db['socket'],'/') || preg_match('/[;\x00-\x1f]/',$db['socket'])) throw new RuntimeException('Invalid local database socket.');
        $address='unix_socket='.$db['socket'];
    }
    return new PDO('mysql:'.$address.';dbname='.$db['name'].';charset=utf8mb4',(string)$db['user'],(string)$db['password'],[
        PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false,PDO::ATTR_TIMEOUT=>3,
    ]);
}
function database_catalog(PDO $pdo): array {
    $rows=$pdo->query('SELECT * FROM nombres_names ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);
    $names=[];
    foreach ($rows as $row) {
        $n=[];
        foreach (['slug','name','gender','origin','meaning'] as $key) $n[$key]=(string)$row[$key];
        foreach (['note','context','native_form','saint'] as $key) if ($row[$key]!==null && $row[$key]!=='') $n[$key]=(string)$row[$key];
        foreach (['tags','variants','review','compare'] as $key) if ($row[$key.'_json']!==null) $n[$key]=json_decode($row[$key.'_json'],true,64,JSON_THROW_ON_ERROR);
        $names[]=$n;
    }
    if (!$names || catalog_errors($names)) throw new RuntimeException('Database catalog is empty or invalid.');
    return $names;
}
function catalog_cache_file(array $config): string {
    $key=hash('sha256',__DIR__.'|'.$config['db']['host'].'|'.$config['db']['name']);
    return rtrim((string)$config['cache_dir'],'/').'/catalog-'.substr($key,0,16).'.json';
}
function read_catalog_cache(string $path): ?array {
    if (!is_file($path)) return null;
    try {
        $names=json_decode((string)file_get_contents($path),true,64,JSON_THROW_ON_ERROR);
        return is_array($names) && $names && !catalog_errors($names) ? $names : null;
    } catch (Throwable) { return null; }
}
function write_catalog_cache(array $config,array $names): void {
    $path=catalog_cache_file($config);$dir=dirname($path);
    if (!is_dir($dir) && !@mkdir($dir,0750,true) && !is_dir($dir)) return;
    if (!is_writable($dir)) return;
    $tmp=@tempnam($dir,'.catalog-');
    if ($tmp===false) return;
    try {
        $json=json_encode($names,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
        if (file_put_contents($tmp,$json,LOCK_EX)===false) return;
        chmod($tmp,0600);rename($tmp,$path);
    } finally { if (is_file($tmp)) unlink($tmp); }
}
function invalidate_catalog_cache(array $config): void {
    $path=catalog_cache_file($config);
    if (is_file($path)) unlink($path);
}
function load_public_catalog(array $config): array {
    global $catalogStorageStatus;
    $catalogStorageStatus='file';
    $file=__DIR__.'/../content/names.php';
    if ($config['storage']==='file') return require $file;
    $cacheFile=catalog_cache_file($config);$cached=read_catalog_cache($cacheFile);
    if ($cached && time()-(int)filemtime($cacheFile)<$config['cache_ttl']) { $catalogStorageStatus='mysql-cache';return $cached; }
    try {
        $names=database_catalog(database_connection($config));
        write_catalog_cache($config,$names);
        $catalogStorageStatus='mysql';
        return $names;
    } catch (Throwable) {
        // No SQL exceptions, credentials or connection strings reach the visitor.
        error_log('nombres: database catalog unavailable; serving the last valid snapshot. Run the private database check.');
        $catalogStorageStatus=$cached?'mysql-stale-cache':'file-fallback';
        return $cached ?? require $file;
    }
}
