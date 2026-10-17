<?php declare(strict_types=1); ?>
<footer class="site-footer"><div class="wrap"><div class="foot-top"><a class="brand brand-foot" href="/">nombres<span>.com.py</span></a><p>Ideas para encontrar un nombre que se sienta de tu familia.</p></div>
<nav aria-label="Pie de página"><ul><?php foreach ($copy['LISTS'] as $l): ?><li><a href="<?= e($l['route']) ?>"><?= e($l['h1']) ?></a></li><?php endforeach ?><li><a href="/elegir/">Buscador de nombres</a></li><li><a href="/como-elegir-nombre-de-bebe/">Cómo elegir el nombre</a></li><li><a href="/fuentes/">Fuentes y criterios</a></li><li><a href="/privacidad/">Privacidad</a></li></ul></nav>
<p>¿Estás esperando un bebé? Conocé <a href="<?= e($site['app']) ?>">Mi Bebé, la app gratuita</a>.</p>
<p class="fine">También para la familia de cuatro patas: <a href="/nombres-para-perros/">nombres para perros</a> · <a href="/nombres-para-gatos/">nombres para gatos</a>.</p>
<p class="fine">Significados orientativos, con notas cuando el origen es discutido. No publicamos estadísticas de popularidad. Este sitio no brinda consejos médicos.</p>
</div></footer></body></html>
