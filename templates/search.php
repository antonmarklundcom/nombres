<?php declare(strict_types=1); ?>
<h1><?= e($page['h1']) ?></h1><p class="lead"><?= e($copy['ELEGIR']['lead']) ?></p>
<?php search_form(); ?>
<noscript><p class="note">Podés buscar con el botón y recorrer los resultados sin JavaScript. Para guardar favoritos necesitás activarlo.</p></noscript>
<div data-tool-results><p><?= $page['resultCount'] ?> nombres<?php if ($page['searchPages']>1): ?> · página <?= $page['searchPage'] ?> de <?= $page['searchPages'] ?><?php endif ?></p><?php if ($page['items']): cards($page['items']); else: ?><p>No encontramos nombres con esos filtros. Probá otra búsqueda.</p><?php endif ?><?php if ($page['searchPages']>1): ?><nav class="row" aria-label="Páginas de resultados"><?php foreach ([-1=>'Anterior',1=>'Siguiente'] as $direction=>$label): $next=$page['searchPage']+$direction; if ($next<1||$next>$page['searchPages']) continue; ?><a class="btn btn-ghost" href="/elegir/?<?= e(http_build_query(array_filter($page['searchArgs'],static fn($v)=>$v!=='')+['p'=>$next])) ?>"><?= e($label) ?></a><?php endforeach ?></nav><?php endif ?></div>
<?php mini_list(); list_links(); app_block(); ?>
