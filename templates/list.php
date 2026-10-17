<?php declare(strict_types=1); ?>
<h1><?= e($page['h1']) ?></h1><div class="intro" data-intro><?php foreach ($page['intro'] as $p): ?><p><?= e($p) ?></p><?php endforeach ?></div>
<?php list_links($page['route']); ?>
<h2><?= count($page['items']) ?> nombres para explorar</h2><p class="sub">Tocá el corazón para armar tu lista. El orden es alfabético.</p>
<?php cards(array_slice($page['items'],0,12)); app_block(); if (count($page['items'])>12) cards(array_slice($page['items'],12)); ?>
<p><a class="btn" href="/elegir/">Afiná la búsqueda</a><a class="btn btn-ghost" href="/mi-lista/">Ver mis favoritos</a></p>
<?php az_bar($page['letter'] ?? null); faq($page['faq'] ?? []); ?>
