<?php declare(strict_types=1); ?>
<h1><?= e($page['h1']) ?></h1><p class="lead"><?= e($copy['ELEGIR']['lead']) ?></p>
<?php search_form(); ?>
<noscript><p class="note">Podés buscar con el botón y recorrer los resultados sin JavaScript. Para guardar favoritos necesitás activarlo.</p></noscript>
<div data-tool-results><p><?= count($page['items']) ?> nombres</p><?php cards($page['items']); ?></div>
<?php mini_list(); list_links(); app_block(); ?>
