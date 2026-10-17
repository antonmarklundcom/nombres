<?php
declare(strict_types=1);
require_once __DIR__ . '/catalog.php';
$site = require __DIR__ . '/../content/site.php';
$copy = require __DIR__ . '/../content/editorial.php';
$names = require __DIR__ . '/../content/names.php';
$bySlug = [];
foreach ($names as $n) $bySlug[$n['slug']] = $n;
$sorted = $names;
usort($sorted, static fn($a, $b) => strcmp(fold($a['name']), fold($b['name'])) ?: strcmp($a['slug'], $b['slug']));
$letters = array_values(array_unique(array_map(static fn($n) => $n['slug'][0], $sorted)));
sort($letters);
$tagRoutes = ['guarani'=>'/nombres-guaranies/','corto'=>'/nombres-cortos/','compuesto'=>'/nombres-compuestos/','biblico'=>'/nombres-biblicos/','clasico'=>'/nombres-clasicos/','moderno'=>'/nombres-modernos/','unisex'=>'/nombres-unisex/'];
$genderRoutes = ['f'=>'/nombres-de-nina/','m'=>'/nombres-de-varon/','u'=>'/nombres-unisex/'];

function e(mixed $s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function json_safe(mixed $v): string { return json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR); }
function asset(string $path): string { return $path . '?v=' . substr(hash_file('sha256', __DIR__ . '/..' . $path), 0, 10); }
function matches(array $n, array $filter): bool { return (!isset($filter['gender']) || $n['gender'] === $filter['gender']) && (!isset($filter['tag']) || in_array($filter['tag'], $n['tags'], true)); }
function name_url(array $n): string { return '/nombre/' . $n['slug'] . '/'; }
function ulen(string $s): int { return preg_match_all('/./us', $s); }
function truncate_text(string $s, int $limit): string { preg_match_all('/./us', $s, $m); return implode('', array_slice($m[0], 0, $limit)); }
function description(string $base): string {
    $base = trim($base);
    if (ulen($base) < 120) $base .= ' Guardá tus favoritos y compará ideas para elegir el nombre de tu bebé en Paraguay.';
    if (ulen($base) > 160) $base = rtrim(preg_replace('/\s+\S*$/u', '', truncate_text($base, 157)), ' ,;:.') . '…';
    return $base;
}
function routes(): array {
    global $copy, $sorted, $letters;
    return array_merge(['/', '/elegir/', $copy['GUIDE']['route'], '/privacidad/', '/fuentes/', '/nombres-para-perros/', '/nombres-para-gatos/'], array_column($copy['LISTS'], 'route'), array_map(static fn($l) => "/letra/$l/", $letters), array_map('name_url', $sorted));
}
function related_names(array $n): array {
    global $sorted;
    $other = array_filter($sorted, static fn($x) => $x['slug'] !== $n['slug']);
    $score = static fn($x) => ($x['gender'] === $n['gender'] ? 3 : 0) + ($x['origin'] === $n['origin'] ? 4 : 0) + ($x['slug'][0] === $n['slug'][0] ? 2 : 0) + count(array_intersect($x['tags'], $n['tags']));
    usort($other, static fn($a, $b) => $score($b) <=> $score($a) ?: strcmp(fold($a['name']), fold($b['name'])));
    return array_slice($other, 0, 6);
}
