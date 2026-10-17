<?php declare(strict_types=1); ?>
<!doctype html>
<html lang="es-PY"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($page['title']) ?></title>
<meta name="description" content="<?= e($page['description']) ?>">
<?php if ($page['route'] !== null): ?><link rel="canonical" href="<?= e($site['origin'] . $page['route']) ?>"><?php endif ?>
<?php if ($page['noindex'] ?? false): ?><meta name="robots" content="noindex, follow"><?php endif ?>
<meta property="og:type" content="<?= e($page['ogType'] ?? 'website') ?>">
<meta property="og:site_name" content="nombres.com.py"><meta property="og:locale" content="es_PY">
<meta property="og:title" content="<?= e($page['title']) ?>"><meta property="og:description" content="<?= e($page['description']) ?>">
<?php if ($page['route'] !== null): ?><meta property="og:url" content="<?= e($site['origin'] . $page['route']) ?>"><?php endif ?>
<meta property="og:image" content="<?= e($site['origin'] . asset('/assets/og.png')) ?>"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="nombres.com.py, nombres de bebé para Paraguay">
<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#fbf6f0">
<link rel="icon" href="<?= e(asset('/assets/favicon.svg')) ?>" type="image/svg+xml">
<link rel="preload" href="<?= e(asset('/assets/fonts/instrument-serif-400.woff2')) ?>" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="<?= e(asset('/assets/fonts/dm-sans-400.woff2')) ?>" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:'Instrument Serif';font-weight:400;font-display:swap;src:url('<?= e(asset('/assets/fonts/instrument-serif-400.woff2')) ?>') format('woff2')}
@font-face{font-family:'DM Sans';font-weight:400;font-display:swap;src:url('<?= e(asset('/assets/fonts/dm-sans-400.woff2')) ?>') format('woff2')}
@font-face{font-family:'DM Sans';font-weight:700;font-display:swap;src:url('<?= e(asset('/assets/fonts/dm-sans-700.woff2')) ?>') format('woff2')}
</style>
<link rel="stylesheet" href="<?= e(asset('/assets/site.css')) ?>">
<script type="application/ld+json"><?= json_safe($schema) ?></script>
<script src="<?= e(asset('/assets/app.js')) ?>" defer></script>
</head>
<body data-names="/assets/names.json?v=<?= substr(hash_file('sha256',__DIR__.'/../content/names.php'),0,10) ?>"<?= ($page['route'] ?? '')==='/elegir/' ? ' data-tool-auto' : '' ?>>
<svg class="sprite" aria-hidden="true" focusable="false"><symbol id="h" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></symbol></svg>
<a class="skip" href="#main">Saltar al contenido</a>
