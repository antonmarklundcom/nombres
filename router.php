<?php
declare(strict_types=1);
// PHP development-server router; mirrors the public-file allowlist in .htaccess.
$path=rawurldecode((string)parse_url($_SERVER['REQUEST_URI'] ?? '/',PHP_URL_PATH));
if (preg_match('#^/\.well-known/acme-challenge/[A-Za-z0-9_-]+$#D',$path) && is_file(__DIR__.$path)) return false;
if (preg_match('#^/assets/(?!.*(?:^|/)\.)([a-zA-Z0-9_/-]+)\.(?:css|js|png|svg|webp|avif|woff2|txt)$#D',$path) && !str_contains($path,'..') && is_file(__DIR__.$path)) return false;
require __DIR__.'/index.php';
