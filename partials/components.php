<?php
declare(strict_types=1);

function favorite(array $n, bool $large = false): void { ?>
<button type="button" class="fav<?= $large ? ' fav-lg' : '' ?>" data-slug="<?= e($n['slug']) ?>" data-name="<?= e($n['name']) ?>" aria-pressed="false" aria-label="Guardar <?= e($n['name']) ?> en mi lista" hidden><svg aria-hidden="true" focusable="false"><use href="#h"/></svg></button>
<?php }
function cards(array $list): void { ?>
<ul class="cards"><?php foreach ($list as $n): ?><li class="card g-<?= e($n['gender']) ?>"><a class="card-link" href="<?= e(name_url($n)) ?>"><span class="card-name"><?= e($n['name']) ?></span><span class="card-mean"><?= e($n['meaning']) ?></span><span class="card-meta"><?= e($n['origin']) ?> · <?= e(['f'=>'niña','m'=>'varón','u'=>'unisex'][$n['gender']]) ?></span></a><?php favorite($n); ?></li><?php endforeach ?></ul>
<?php }
function az_bar(?string $current = null): void {
    global $letters; ?>
<nav class="az" aria-label="Nombres por letra inicial"><ul><?php foreach (range('a','z') as $l): ?><li><?php if (in_array($l,$letters,true)): ?><a href="/letra/<?= $l ?>/"<?= $current === $l ? ' aria-current="page"' : '' ?>><?= strtoupper($l) ?></a><?php else: ?><span aria-hidden="true"><?= strtoupper($l) ?></span><?php endif ?></li><?php endforeach ?></ul></nav>
<?php }
function list_links(?string $except = null): void {
    global $copy; ?>
<nav class="lists" aria-label="Listas de nombres"><ul><?php foreach ($copy['LISTS'] as $l): if ($l['route'] === $except) continue; ?><li><a href="<?= e($l['route']) ?>"><?= e($l['short']) ?></a></li><?php endforeach ?></ul></nav>
<?php }
function faq(array $questions): void { if (!$questions) return; ?>
<section class="faq" aria-labelledby="faq-h"><h2 id="faq-h">Preguntas frecuentes</h2><?php foreach ($questions as $q): ?><details><summary><?= e($q['q']) ?></summary><p><?= e($q['a']) ?></p></details><?php endforeach ?></section>
<?php }
function mini_list(): void { ?>
<aside class="mini" data-mini hidden aria-labelledby="mini-h"><h2 id="mini-h">Mi lista</h2><p data-mini-empty>Todavía no guardaste nombres. Tocá el corazón de cualquier tarjeta.</p><ul class="chips" data-mini-list></ul><p><a class="btn" href="/mi-lista/">Abrir mis favoritos</a></p></aside>
<?php }
function search_form(): void {
    global $sorted, $copy, $letters;
    $origins = [];
    foreach ($sorted as $n) foreach (explode(' y ', $n['origin']) as $o) $origins[$o] = $o;
    asort($origins);
    $value = static fn($k) => is_string($_GET[$k] ?? null) ? $_GET[$k] : '';
    $opt = static function ($v,$label,$key) use ($value): void { ?><option value="<?= e($v) ?>"<?= $value($key)===$v ? ' selected' : '' ?>><?= e($label) ?></option><?php }; ?>
<form class="tool" data-tool action="/elegir/" method="get" role="search">
<div class="field field-q"><label for="q">Buscá un nombre</label><input id="q" name="q" type="search" autocomplete="off" maxlength="80" placeholder="Ej.: Aramí, Sofía, Mateo" value="<?= e($value('q')) ?>"></div>
<div class="field"><label for="f-g">Género</label><select id="f-g" name="g"><option value="">Todos</option><?php foreach (['f'=>'Niña','m'=>'Varón','u'=>'Unisex'] as $v=>$label) $opt($v,$label,'g'); ?></select></div>
<div class="field"><label for="f-o">Origen</label><select id="f-o" name="o"><option value="">Todos</option><?php foreach ($origins as $o) $opt($o,ucfirst($o),'o'); ?></select></div>
<div class="field"><label for="f-t">Estilo</label><select id="f-t" name="t"><option value="">Todos</option><?php foreach ($copy['TAG_LABEL'] as $v=>$label) $opt($v,$label,'t'); ?></select></div>
<div class="field"><label for="f-l">Letra inicial</label><select id="f-l" name="l"><option value="">Todas</option><?php foreach ($letters as $l) $opt($l,strtoupper($l),'l'); ?></select></div>
<div class="field"><label for="f-n">Largo máximo</label><select id="f-n" name="n"><option value="">Cualquiera</option><?php foreach (['4','5','6','8'] as $len) $opt($len,"Hasta $len letras",'n'); ?></select></div>
<div class="row"><button type="submit" class="btn">Buscar nombres</button><button type="reset" class="btn btn-ghost">Limpiar</button></div>
</form><p class="tool-count" data-tool-count aria-live="polite"></p>
<?php }
function app_block(): void { global $site; require __DIR__ . '/mi-bebe.php'; }
