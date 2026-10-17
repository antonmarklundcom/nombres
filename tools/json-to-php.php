<?php
declare(strict_types=1);
// Research/content conversion helper. Writes stdout; never overwrites a file.
if (PHP_SAPI!=='cli') { http_response_code(404);exit; }
$path=$argv[1]??'';
if (!is_file($path)) { fwrite(STDERR,"Provide an existing JSON file\n");exit(2); }
$data=json_decode((string)file_get_contents($path),true,128,JSON_THROW_ON_ERROR);
echo "<?php\ndeclare(strict_types=1);\n// Versioned editorial data. Sources and refresh procedure: docs/data-sources.md.\nreturn ".var_export($data,true).";\n";
