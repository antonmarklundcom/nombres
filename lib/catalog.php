<?php
declare(strict_types=1);

const NAME_TAGS = ['clasico', 'moderno', 'corto', 'compuesto', 'biblico', 'guarani', 'santo', 'unisex'];

function catalog_errors(array $names): array
{
    $errors = [];
    $slugs = [];
    $labels = [];
    foreach ($names as $i => $n) {
        if (!is_array($n)) { $errors[] = "Row $i is not a record"; continue; }
        $slug = $n['slug'] ?? "row-$i";
        foreach (['slug','name','gender','origin','meaning'] as $key) {
            if (!isset($n[$key]) || !is_string($n[$key]) || trim($n[$key]) === '') $errors[] = "$slug: missing $key";
        }
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D', (string)$slug)) $errors[] = "$slug: invalid slug";
        if (isset($slugs[$slug])) $errors[] = "$slug: duplicate slug";
        $slugs[$slug] = true;
        $label = fold($n['name'] ?? '');
        if (isset($labels[$label])) $errors[] = "$slug: duplicate normalized name";
        $labels[$label] = true;
        if (!in_array($n['gender'] ?? null, ['f','m','u'], true)) $errors[] = "$slug: invalid gender";
        $tags = $n['tags'] ?? null;
        if (!is_array($tags) || array_diff($tags, NAME_TAGS) || count(array_unique($tags)) !== count($tags)) $errors[] = "$slug: invalid tags";
        if (is_array($tags)) {
            foreach (['unisex' => ($n['gender'] ?? '') === 'u', 'compuesto' => str_contains($n['name'] ?? '', ' '), 'guarani' => ($n['origin'] ?? '') === 'guaraní', 'santo' => !empty($n['saint'])] as $tag => $expected) {
                if (in_array($tag, $tags, true) !== $expected) $errors[] = "$slug: inconsistent $tag";
            }
        }
        foreach (['name','origin','meaning','note','native_form','context'] as $key) {
            if (isset($n[$key]) && (!is_string($n[$key]) || preg_match('/[<>\x00-\x08]/', $n[$key]))) $errors[] = "$slug: invalid plain text $key";
        }
        if (isset($n['variants']) && (!is_array($n['variants']) || array_filter($n['variants'], static fn($v) => !is_string($v) || trim($v) === '' || preg_match('/[<>]/', $v)))) $errors[] = "$slug: invalid variants";
        if (isset($n['compare'])) {
            if (!is_array($n['compare']) || !array_is_list($n['compare']) || array_filter($n['compare'], static fn($v) => !is_string($v) || !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D',$v))) $errors[] = "$slug: invalid comparison slugs";
        }
        if (!in_array($n['review']['status'] ?? '', ['legacy','qualified','verified'], true)) $errors[] = "$slug: invalid review status";
        $sources = $n['review']['sources'] ?? null;
        if (!is_array($sources)) $errors[] = "$slug: sources must be an array";
        else foreach ($sources as $source) {
            if (!is_array($source) || empty($source['title']) || !filter_var($source['url'] ?? '', FILTER_VALIDATE_URL) || !str_starts_with($source['url'], 'https://') || !preg_match('/^\d{4}-\d{2}-\d{2}$/D', $source['checked'] ?? '')) $errors[] = "$slug: source needs title, https URL and checked date";
        }
        if (($n['review']['status'] ?? '') === 'verified' && empty($sources)) $errors[] = "$slug: verified requires documentary evidence";
    }
    foreach ($names as $n) {
        if (!is_array($n) || !is_array($n['compare'] ?? null)) continue;
        foreach ($n['compare'] as $target) {
            if (is_string($target) && (!isset($slugs[$target]) || $target===($n['slug']??null))) $errors[] = ($n['slug']??'record').": invalid comparison target $target";
        }
    }
    return $errors;
}

// No mbstring or intl extension required on shared hosting.
function fold(string $s): string
{
    return strtolower(preg_replace('/\p{M}/u', '', strtr($s, ['Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o','Ú'=>'u','Ü'=>'u','Ñ'=>'n','Ã'=>'a','Ẽ'=>'e','Ĩ'=>'i','Õ'=>'o','Ũ'=>'u','Ỹ'=>'y','á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n','ã'=>'a','ẽ'=>'e','ĩ'=>'i','õ'=>'o','ũ'=>'u','ỹ'=>'y'])));
}
