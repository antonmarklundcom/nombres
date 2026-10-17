<?php
declare(strict_types=1);
require __DIR__.'/../lib/bootstrap.php';
echo json_encode(['indexable'=>routes(),'noindex'=>['/mi-lista/'],'names'=>count($names)],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR)."\n";
