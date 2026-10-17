<?php
declare(strict_types=1);

const NAME_TAGS = ['clasico', 'moderno', 'corto', 'compuesto', 'biblico', 'guarani', 'santo', 'unisex'];

function catalog_errors(array $names, bool $checkReferences = true): array
{
    $errors = [];
    $slugs = [];
    $labels = [];
    foreach ($names as $i => $n) {
        if (!is_array($n)) { $errors[] = "Row $i is not a record"; continue; }
        $slug = is_string($n['slug']??null) ? $n['slug'] : "row-$i";
        $validRequired=true;
        foreach (['slug','name','gender','origin','meaning'] as $key) {
            if (!isset($n[$key]) || !is_string($n[$key]) || trim($n[$key]) === '') { $errors[] = "$slug: missing or invalid $key";$validRequired=false; }
        }
        if (!$validRequired) continue;
        $unknown=array_diff(array_keys($n),['slug','name','gender','origin','meaning','tags','review','variants','saint','note','native_form','context','compare']);
        if ($unknown) $errors[]="$slug: unsupported fields: ".implode(', ',$unknown);
        foreach (['name'=>160,'origin'=>120,'native_form'=>160,'saint'=>64] as $key=>$max) if (isset($n[$key]) && is_string($n[$key]) && preg_match_all('/./us',$n[$key])>$max) $errors[]="$slug: $key exceeds $max characters";
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D', (string)$slug)) $errors[] = "$slug: invalid slug";
        if (strlen((string)$slug)>100) $errors[] = "$slug: slug exceeds 100 characters";
        if (isset($slugs[$slug])) $errors[] = "$slug: duplicate slug";
        $slugs[$slug] = true;
        $label = fold($n['name'] ?? '');
        if (isset($labels[$label])) $errors[] = "$slug: duplicate normalized name";
        $labels[$label] = true;
        if (!in_array($n['gender'] ?? null, ['f','m','u'], true)) $errors[] = "$slug: invalid gender";
        $tags = $n['tags'] ?? null;
        $validTags=is_array($tags) && array_is_list($tags) && !array_filter($tags,static fn($t)=>!is_string($t));
        if (!$validTags || array_diff($tags, NAME_TAGS) || count(array_unique($tags)) !== count($tags)) $errors[] = "$slug: invalid tags";
        if ($validTags) {
            foreach (['unisex' => ($n['gender'] ?? '') === 'u', 'compuesto' => str_contains($n['name'] ?? '', ' '), 'guarani' => ($n['origin'] ?? '') === 'guaraní', 'santo' => !empty($n['saint'])] as $tag => $expected) {
                if (in_array($tag, $tags, true) !== $expected) $errors[] = "$slug: inconsistent $tag";
            }
        }
        foreach (['name','origin','meaning','note','native_form','context','saint'] as $key) {
            if (isset($n[$key]) && (!is_string($n[$key]) || preg_match('/[<>\x00-\x08]/', $n[$key]))) $errors[] = "$slug: invalid plain text $key";
        }
        if (isset($n['variants']) && (!is_array($n['variants']) || !array_is_list($n['variants']) || array_filter($n['variants'], static fn($v) => !is_string($v) || trim($v) === '' || preg_match('/[<>]/', $v)))) $errors[] = "$slug: invalid variants";
        if (isset($n['compare'])) {
            if (!is_array($n['compare']) || !array_is_list($n['compare']) || array_filter($n['compare'], static fn($v) => !is_string($v) || !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D',$v))) $errors[] = "$slug: invalid comparison slugs";
        }
        if (!is_array($n['review']??null)) { $errors[]="$slug: review must be a record";continue; }
        if (isset($n['review']['note']) && (!is_string($n['review']['note']) || preg_match('/[<>\x00-\x08]/',$n['review']['note']))) $errors[]="$slug: invalid review note";
        if (!in_array($n['review']['status'] ?? '', ['legacy','qualified','verified'], true)) $errors[] = "$slug: invalid review status";
        $sources = $n['review']['sources'] ?? null;
        if (!is_array($sources) || !array_is_list($sources)) $errors[] = "$slug: sources must be a list";
        else foreach ($sources as $source) {
            if (!is_array($source) || !is_string($source['title']??null) || $source['title']==='' || !is_string($source['url']??null) || !filter_var($source['url'], FILTER_VALIDATE_URL) || !str_starts_with($source['url'], 'https://') || !is_string($source['checked']??null) || !preg_match('/^\d{4}-\d{2}-\d{2}$/D', $source['checked'])) $errors[] = "$slug: source needs title, https URL and checked date";
            if (!is_array($source)) continue;
            foreach (['title','scope'] as $key) if (isset($source[$key]) && (!is_string($source[$key]) || preg_match('/[<>\x00-\x08]/',$source[$key]))) $errors[]="$slug: invalid source $key";
            if (is_string($source['checked']??null) && preg_match('/^(\d{4})-(\d{2})-(\d{2})$/D',$source['checked'],$date) && !checkdate((int)$date[2],(int)$date[3],(int)$date[1])) $errors[]="$slug: invalid source calendar date";
        }
        if (($n['review']['status'] ?? '') === 'verified' && empty($sources)) $errors[] = "$slug: verified requires documentary evidence";
    }
    foreach ($names as $n) {
        if (!is_array($n) || !is_array($n['compare'] ?? null)) continue;
        foreach ($n['compare'] as $target) {
            if (is_string($target) && (($checkReferences && !isset($slugs[$target])) || $target===($n['slug']??null))) $errors[] = ($n['slug']??'record').": invalid comparison target $target";
        }
    }
    return $errors;
}

// No mbstring or intl extension required on shared hosting.
function fold(string $s): string
{
    $s=strtr($s,['À'=>'a','Â'=>'a','Ä'=>'a','Å'=>'a','à'=>'a','â'=>'a','ä'=>'a','å'=>'a','Æ'=>'ae','æ'=>'ae','Ç'=>'c','ç'=>'c','È'=>'e','Ê'=>'e','Ë'=>'e','è'=>'e','ê'=>'e','ë'=>'e','Ì'=>'i','Î'=>'i','Ï'=>'i','ì'=>'i','î'=>'i','ï'=>'i','Ò'=>'o','Ô'=>'o','Ö'=>'o','Ø'=>'o','ò'=>'o','ô'=>'o','ö'=>'o','ø'=>'o','Œ'=>'oe','œ'=>'oe','Ù'=>'u','Û'=>'u','ù'=>'u','û'=>'u','Ý'=>'y','Ÿ'=>'y','ý'=>'y','ÿ'=>'y']);
    return strtolower(preg_replace('/\p{M}/u', '', strtr($s, ['Á'=>'a','É'=>'e','Í'=>'i','Ó'=>'o','Ú'=>'u','Ü'=>'u','Ñ'=>'n','Ã'=>'a','Ẽ'=>'e','Ĩ'=>'i','Õ'=>'o','Ũ'=>'u','Ỹ'=>'y','á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u','ü'=>'u','ñ'=>'n','ã'=>'a','ẽ'=>'e','ĩ'=>'i','õ'=>'o','ũ'=>'u','ỹ'=>'y'])));
}
