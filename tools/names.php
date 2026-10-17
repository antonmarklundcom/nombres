<?php
declare(strict_types=1);
// CLI only. A JSON import is a content update, never a web endpoint.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/../lib/bootstrap.php';
$command=$argv[1]??'validate';
$catalog=__DIR__.'/../content/names.php';
function finish_errors(array $records): void {
    $errors=catalog_errors($records);
    if ($errors) { fwrite(STDERR,implode("\n",$errors)."\n"); exit(1); }
}
if ($command==='validate') {
    finish_errors($names);
    echo 'PASS: '.count($names)." names, unique slugs and names, valid tags and review evidence\n";
} elseif ($command==='export') {
    echo json_encode($names,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR)."\n";
} elseif ($command==='upsert') {
    $path=$argv[2]??'';
    if (!$path || !is_file($path)) { fwrite(STDERR,"Usage: php tools/names.php upsert /path/records.json [--write]\n"); exit(2); }
    try { $incoming=json_decode(file_get_contents($path),true,64,JSON_THROW_ON_ERROR); }
    catch (Throwable $e) { fwrite(STDERR,"Invalid JSON: ".$e->getMessage()."\n"); exit(1); }
    if (!is_array($incoming) || !array_is_list($incoming)) { fwrite(STDERR,"Input must be a JSON array of complete name records\n"); exit(1); }
    finish_errors($incoming);
    $merged=$bySlug;
    foreach ($incoming as $n) $merged[$n['slug']]=$n;
    $records=array_values($merged);
    finish_errors($records);
    foreach ($incoming as $n) echo (isset($bySlug[$n['slug']])?'UPDATE ':'ADD ').$n['slug']."\n";
    if (!in_array('--write',$argv,true)) { echo "DRY RUN: valid, no file changed. Add --write to apply, then review git diff.\n"; exit; }
    $export = static function (mixed $value) use (&$export): string {
        if (!is_array($value)) return var_export($value,true);
        $parts=[];
        foreach ($value as $k=>$v) $parts[]=(array_is_list($value)?'':var_export($k,true).' => ').$export($v);
        return '['.implode(', ',$parts).']';
    };
    $rows=array_map(static fn($n)=>'    '.$export($n).',',$records);
    $text="<?php\ndeclare(strict_types=1);\n// Canonical name catalog. See docs/content-model.md before editing.\n// One record per line; the slug is a permanent URL identity.\nreturn [\n".implode("\n",$rows)."\n];\n";
    $tmp=tempnam(dirname($catalog),'.names-');
    if ($tmp===false || file_put_contents($tmp,$text)===false) throw new RuntimeException('Could not write catalog');
    chmod($tmp,0644);
    if (!rename($tmp,$catalog)) { unlink($tmp); throw new RuntimeException('Could not replace catalog'); }
    echo "Saved. Run php tools/names.php validate and ./verify.sh before committing.\n";
} else {
    fwrite(STDERR,"Commands: validate | export | upsert file.json [--write]\n"); exit(2);
}
