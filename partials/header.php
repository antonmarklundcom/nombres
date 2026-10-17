<?php declare(strict_types=1); ?>
<header class="site-header"><div class="wrap hdr">
<a class="brand" href="/" aria-label="nombres.com.py, inicio"><svg class="brand-mark" viewBox="0 0 24 24" aria-hidden="true"><use href="#h"/></svg>nombres<span>.com.py</span></a>
<nav class="nav" aria-label="Principal"><ul><?php foreach (['/nombres-de-nina/'=>'Niña','/nombres-de-varon/'=>'Varón','/nombres-guaranies/'=>'Guaraníes','/nombres-unisex/'=>'Unisex','/elegir/'=>'Buscador','/como-elegir-nombre-de-bebe/'=>'Cómo elegir'] as $url=>$label): ?><li><a href="<?= e($url) ?>"<?= $page['route']===$url ? ' aria-current="page"' : '' ?>><?= e($label) ?></a></li><?php endforeach ?></ul></nav>
<a class="hdr-list" href="/mi-lista/"><svg aria-hidden="true" viewBox="0 0 24 24"><use href="#h"/></svg>Mi lista <span class="count" data-fav-count>0</span></a>
</div></header>
