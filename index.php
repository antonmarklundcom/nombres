<?php
declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/partials/components.php';
if (!empty($runtimeConfig['diagnostics'])) header('X-Nombres-Storage: '.($catalogStorageStatus??'file'));
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Frame-Options: SAMEORIGIN');
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'");
$path = rawurldecode((string)parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));
$allRoutes = routes();
$redirect = static function (string $to): never {
    $query = $_SERVER['QUERY_STRING'] ?? '';
    header('Location: ' . $to . ($query !== '' ? '?' . $query : ''), true, 301);
    exit;
};
if (in_array($path, ['/index.php','/index.html'],true)) $redirect('/');
if ($path === '/sitemap.php') $redirect('/sitemap.xml');
if ($path === '/robots.php') $redirect('/robots.txt');
if (isset($site['redirects'][$path])) $redirect($site['redirects'][$path]);
if (str_ends_with($path, '/index.html')) {
    $target = substr($path, 0, -10);
    if (in_array($target,$allRoutes,true) || $target === '/mi-lista/') $redirect($target);
}
if (!str_ends_with($path,'/') && (in_array($path.'/',$allRoutes,true) || $path==='/mi-lista')) $redirect($path.'/');
if ($path === '/sitemap.xml') {
    header('Content-Type: application/xml; charset=utf-8');
    header('Cache-Control: public, max-age=300, must-revalidate');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($allRoutes as $route) echo '<url><loc>' . e($site['origin'].$route) . "</loc></url>\n";
    echo '</urlset>';
    exit;
}
if ($path === '/robots.txt') {
    header('Content-Type: text/plain; charset=utf-8');
    echo "User-agent: *\nAllow: /\nDisallow: /content/\nDisallow: /tools/\nDisallow: /docs/\n\nSitemap: " . $site['origin'] . "/sitemap.xml\n";
    exit;
}
if ($path === '/assets/names.json') {
    header('Content-Type: application/json; charset=utf-8');
    header('X-Robots-Tag: noindex');
    header('Cache-Control: public, max-age=300, must-revalidate');
    $etag='"names-'.$catalogVersion.'"';header('ETag: '.$etag);
    if (($_SERVER['HTTP_IF_NONE_MATCH']??'')===$etag) { http_response_code(304);exit; }
    echo json_safe(['tags'=>NAME_TAGS, 'n'=>array_map(static fn($n)=>[$n['slug'],$n['name'],$n['gender'],$n['origin'],$n['meaning'],implode('',array_map(static fn($t)=>(string)array_search($t,NAME_TAGS,true),$n['tags']))],$sorted)]);
    exit;
}
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: private, no-cache');
$page = ['route'=>$path, 'noindex'=>false, 'faq'=>[], 'title'=>$copy['NOT_FOUND']['title'],'description'=>$copy['NOT_FOUND']['description'],'h1'=>$copy['NOT_FOUND']['h1']];
$template = 'not-found';
if ($path === '/') {
    $page = array_merge($page,$copy['HOME']); $template='home';
} elseif ($path === '/elegir/') {
    $page = array_merge($page,$copy['ELEGIR']);
    $args=[];
    foreach (['q','g','o','t','l','n'] as $key) $args[$key]=is_string($_GET[$key]??null) ? truncate_text($_GET[$key],80) : '';
    $matchingNames=array_values(array_filter($sorted, static function($n) use($args) {
        if ($args['g'] !== '' && $args['g'] !== $n['gender']) return false;
        if ($args['o'] !== '' && !in_array($args['o'],origin_parts($n['origin']),true)) return false;
        if ($args['t'] !== '' && !in_array($args['t'],$n['tags'],true)) return false;
        if ($args['l'] !== '' && $args['l'] !== $n['slug'][0]) return false;
        if ((int)$args['n']>0 && preg_match_all('/\p{L}/u',$n['name'])>(int)$args['n']) return false;
        return $args['q']==='' || str_contains(fold($n['name']),fold(trim($args['q'])));
    }));
    $page['resultCount']=count($matchingNames);
    $maxPage=max(1,(int)ceil(count($matchingNames)/48));
    $page['searchPage']=max(1,min($maxPage,is_string($_GET['p']??null)?(int)$_GET['p']:1));
    $page['items']=array_slice($matchingNames,($page['searchPage']-1)*48,48);
    $page['searchPages']=$maxPage;
    $page['searchArgs']=$args;
    $page['noindex']=!empty($_GET); $template='search';
} elseif ($path === '/mi-lista/') {
    $page=array_merge($page,$copy['MI_LISTA']); $page['noindex']=true;
    header('Referrer-Policy: no-referrer'); $template='favorites';
} elseif (preg_match('#^/nombre/([a-z0-9-]+)/$#D',$path,$m) && isset($bySlug[$m[1]])) {
    $n=$bySlug[$m[1]]; $page['name']=$n;
    $page['title']=$n['name'].': significado y origen del nombre'; $page['h1']=$page['title'];
    $page['description']=description($n['name'].', nombre de origen '.$n['origin'].'. '.$n['meaning'].' Mirá formas relacionadas, apellidos y otras ideas para tu bebé.');
    $page['ogType']='article'; $template='name';
} else {
    foreach ($copy['LISTS'] as $l) if ($l['route']===$path) {
        $page=array_merge($page,$l); $page['items']=array_values(array_filter($sorted,static fn($n)=>matches($n,$l['filter'])));
        $template='list'; break;
    }
    if ($template==='not-found' && preg_match('#^/letra/([a-z])/$#D',$path,$m) && in_array($m[1],$letters,true)) {
        $letter=$m[1]; $upper=strtoupper($letter); $page['letter']=$letter;
        $page['title']="Nombres con $upper para bebé: niñas y varones"; $page['h1']="Nombres de bebé con $upper";
        $page['description']=description("Nombres de bebé que empiezan con $upper, con significado y origen. Explorá opciones de niña, de varón y unisex y guardá tus favoritos en tu lista.");
        $page['intro']=["¿Te gusta la inicial $upper? Explorá nombres con esa letra, con sus significados y orígenes. Guardá los que te gustan y probá cómo quedan con tus apellidos."];
        $page['items']=array_values(array_filter($sorted,static fn($n)=>$n['slug'][0]===$letter)); $template='list';
    }
    if ($path===$copy['GUIDE']['route']) {
        $page=array_merge($page,$copy['GUIDE']); $page['ogType']='article'; $template='article';
    } elseif ($path==='/privacidad/') {
        $page=array_merge($page,$copy['PRIVACY']); $page['sections']=[['h'=>null,'p'=>$copy['PRIVACY']['p']]]; $template='article';
    } elseif ($path==='/fuentes/') {
        $page['title']='Fuentes y criterios de los nombres | nombres.com.py'; $page['h1']='Fuentes y criterios del catálogo';
        $page['description']=description('Cómo trabajamos los significados de nombres de bebé: fuentes, etimologías discutidas, escritura guaraní y límites de la información en nombres.com.py.');
        $page['sections']=[
            ['h'=>'Qué significa el origen de un nombre','p'=>['Una palabra, una leyenda y un nombre propio no son lo mismo. Un nombre puede llegar por distintos idiomas; la lengua de origen que mostramos resume su tradición y no garantiza una traducción literal.','Este sitio nació de un catálogo de 546 nombres. Revisamos su estructura y corregimos interpretaciones problemáticas, pero todavía no completamos el contraste documental independiente de cada ficha. No presentamos esa revisión editorial como una certificación lingüística.']],
            ['h'=>'Cómo tratamos las dudas','p'=>['Cuando el origen es incierto lo decimos, por ejemplo en María, Catalina o Arturo. No elegimos la explicación más linda para presentarla como un hecho. Las fichas incorporan notas y un espacio para referencias documentales; sólo se marcan como verificadas cuando tienen fuentes registradas.']],
            ['h'=>'Guaraní y nombres propios','p'=>['Conservamos las grafías personales tradicionales y distinguimos, cuando corresponde, la forma guaraní de referencia. Las vocales nasales y la y tienen valor propio. Las categorías niña, varón y unisex son filtros editoriales y no expresan género gramatical del guaraní ni estadísticas de inscripción.','Para confirmar la escritura y la pronunciación, consultá un diccionario actualizado y una persona hablante. La Secretaría de Políticas Lingüísticas y la Academia de la Lengua Guaraní son instituciones de referencia; no afirmamos que hayan revisado o aprobado este catálogo.']],
            ['h'=>'Datos y estilos son cosas distintas','p'=>['El catálogo se ordena para explorar nombres, no como un ranking de nacimientos de Paraguay. Clásico y moderno describen un estilo editorial, no un dato de frecuencia. La presencia de un nombre no prueba su uso en Paraguay ni garantiza que se acepte su inscripción.','La sección de historias presenta tablas de Estados Unidos y Francia de 2024, con su fuente, año y método. Esas cifras respaldan el uso de ciertas grafías en esos registros; no verifican una etimología ni describen la popularidad en Paraguay.']],
            ['h'=>'Antes de la inscripción','p'=>['Confirmá la grafía elegida y los requisitos con el Registro Civil. Para el santoral, consultá también con tu parroquia: un nombre puede tener varias celebraciones. Este catálogo orienta la búsqueda; no brinda asesoramiento legal ni médico.']],
        ]; $template='article';
    } elseif (in_array($path,['/nombres-para-perros/','/nombres-para-gatos/'],true)) {
        $animal=$path==='/nombres-para-perros/'?'perros':'gatos';
        $page['title']="Nombres para $animal: ideas cortas para tu mascota"; $page['h1']="Ideas de nombres para $animal";
        $page['description']=description("Ideas de nombres para $animal: opciones cortas, inspiradas en la naturaleza y fáciles de llamar. Elegí con calma y encontrá un nombre para tu mascota.");
        $page['intro']=["La llegada de una mascota también merece un nombre. Para $animal, ayuda elegir uno que puedas decir claramente y usar siempre de la misma forma. Estas ideas son para mascotas; no son una lista de nombres de bebé ni un ranking de popularidad.", 'Probá el nombre en voz alta, evitá que se confunda con una orden y fijate si toda la familia lo pronuncia de forma parecida.'];
        $page['petGroups']=['Cortos y fáciles de llamar'=> $animal==='perros'?['Coco','Milo','Nala','Toby','Lola','Roco','Kira','Bruno']:['Milo','Mimi','Nina','Coco','Lila','Teo','Lola','Tom'], 'Inspirados en la naturaleza'=>['Luna','Sol','Nube','Brisa','Río','Mora','Oliva','Nieve'], 'Un toque divertido'=> $animal==='perros'?['Chipa','Miel','Pipo','Maní','Pecas','Canela']:['Chipa','Mochi','Miel','Canela','Bigotes','Pecas']];
        $template='pets';
    }
}
if (isset($stories[$path])) {
    $page=array_merge($page,$stories[$path]);$template='story';
    $page['ogType']=$page['kind']==='hub'?'website':'article';
}
if ($template==='not-found') { http_response_code(404); $page['route']=null; $page['noindex']=true; }
$page['description']=description($page['description']);
$crumbs=[['name'=>'Inicio','route'=>'/']];
if ($page['route'] && $page['route']!=='/') {
    if ($template==='name') $crumbs[]=['name'=>['f'=>'Nombres de niña','m'=>'Nombres de varón','u'=>'Nombres unisex'][$n['gender']],'route'=>$genderRoutes[$n['gender']]];
    if ($template==='story' && $page['kind']!=='hub') $crumbs[]=['name'=>'Historias de nombres','route'=>'/historias-de-nombres/'];
    $crumbs[]=['name'=>$template==='name'?$n['name']:$page['h1'],'route'=>$page['route']];
}
$graph=[['@type'=>'WebSite','@id'=>$site['origin'].'/#website','name'=>$site['name'],'url'=>$site['origin'].'/','inLanguage'=>$site['lang']]];
if ($page['route']!==null) $graph[]=['@type'=>'BreadcrumbList','itemListElement'=>array_map(static fn($c,$i)=>['@type'=>'ListItem','position'=>$i+1,'name'=>$c['name'],'item'=>$site['origin'].$c['route']],$crumbs,array_keys($crumbs))];
if (!empty($page['items'])) $graph[]=['@type'=>'ItemList','name'=>$page['h1'],'numberOfItems'=>count($page['items']),'itemListElement'=>array_map(static fn($n,$i)=>['@type'=>'ListItem','position'=>$i+1,'name'=>$n['name'],'url'=>$site['origin'].name_url($n)],$page['items'],array_keys($page['items']))];
if ($page['faq']) $graph[]=['@type'=>'FAQPage','mainEntity'=>array_map(static fn($f)=>['@type'=>'Question','name'=>$f['q'],'acceptedAnswer'=>['@type'=>'Answer','text'=>$f['a']]],$page['faq'])];
if ($template==='story' && $page['kind']!=='hub') {
    $citations=$page['kind']==='country'?[$rankings[$page['country']]['official_url'],$rankings[$page['country']]['mirror_url']]:($page['kind']==='trends'?array_column($rankings,'official_url'):['https://github.com/sugarlabs/diccionario-guarani-castellano-activity/blob/f0001d16948e07227880cebc9be208473c652990/lang/guarani/dic.txt']);
    $graph[]=['@type'=>'Article','headline'=>$page['h1'],'description'=>$page['description'],'mainEntityOfPage'=>$site['origin'].$page['route'],'inLanguage'=>$site['lang'],'publisher'=>['@type'=>'Organization','name'=>$site['name'],'url'=>$site['origin'].'/'],'citation'=>$citations];
}
$schema=['@context'=>'https://schema.org','@graph'=>$graph];
require __DIR__ . '/partials/head.php'; require __DIR__ . '/partials/header.php';
?><main id="main" class="wrap"><?php
if (count($crumbs)>1): ?><nav class="crumbs" aria-label="Ruta"><ol><?php foreach ($crumbs as $i=>$c): ?><li<?= $i===count($crumbs)-1?' aria-current="page"':'' ?>><?php if ($i<count($crumbs)-1): ?><a href="<?= e($c['route']) ?>"><?= e($c['name']) ?></a><?php else: ?><?= e($c['name']) ?><?php endif ?></li><?php endforeach ?></ol></nav><?php endif;
require __DIR__ . '/templates/' . $template . '.php';
?></main><?php require __DIR__ . '/partials/footer.php';
