// node verify.mjs  ->  revisa datos y sitio generado. Imprime PASS/FAIL y sale con 1 si algo falla.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { NAMES, TAGS } from './data/names.mjs';
import { LISTS, GUIDE, SITE } from './content.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
process.chdir(ROOT);
const failures = [];
let checks = 0;
const fail = m => failures.push(m);
const check = (cond, m) => { checks++; if (!cond) fail(m); };
const read = p => readFileSync(p, 'utf8');
const section = (name, fn) => { const before = failures.length; try { fn(); } catch (e) { fail(`${name}: ${e.message}`); } console.log(`${failures.length === before ? 'PASS' : 'FAIL'}: ${name}`); };
const FORBIDDEN = /más popular|mas popular|ranking|top \d|más usados|mas usados|más elegidos/i;
const MONTHS = 'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre';
const words = s => s.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').trim().split(/\s+/).filter(Boolean).length;

// ---------- datos ----------
section('datos de nombres', () => {
  check(NAMES.length >= 450 && NAMES.length <= 650, `cantidad de nombres fuera de 450-650: ${NAMES.length}`);
  const slugs = new Set();
  for (const n of NAMES) {
    const id = n.slug || JSON.stringify(n);
    for (const k of ['slug', 'name', 'gender', 'origin', 'meaning', 'tags']) check(n[k] !== undefined && n[k] !== '', `${id}: falta ${k}`);
    check(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(n.slug), `${id}: slug inválido`);
    check(!slugs.has(n.slug), `${id}: slug repetido`); slugs.add(n.slug);
    check(['f', 'm', 'u'].includes(n.gender), `${id}: género inválido ${n.gender}`);
    check(typeof n.meaning === 'string' && n.meaning.trim().length > 0 && n.meaning.length <= 160, `${id}: significado vacío o > 160`);
    check(Array.isArray(n.tags) && n.tags.every(t => TAGS.includes(t)), `${id}: etiqueta no permitida`);
    check(new Set(n.tags).size === n.tags.length, `${id}: etiqueta repetida`);
    check(n.tags.includes('unisex') === (n.gender === 'u'), `${id}: unisex no coincide con género`);
    check(n.tags.includes('compuesto') === n.name.includes(' '), `${id}: compuesto no coincide`);
    check(n.tags.includes('guarani') === (n.origin === 'guaraní'), `${id}: guaraní no coincide`);
    check(n.tags.includes('santo') === Boolean(n.saint), `${id}: santo sin fecha o al revés`);
    if (n.saint) check(new RegExp(`^([1-9]|[12]\\d|3[01]) de (${MONTHS})$`).test(n.saint), `${id}: fecha de santo inválida`);
    if (n.variants) check(Array.isArray(n.variants) && n.variants.length > 0, `${id}: variantes inválidas`);
    if (n.note) check(n.note.length <= 200 && !/[.!?].+[.!?].+[.!?]/.test(n.note), `${id}: nota demasiado larga`);
    check(!FORBIDDEN.test(JSON.stringify(n)), `${id}: frase de popularidad en datos`);
  }
  const g = NAMES.filter(n => n.tags.includes('guarani')).length;
  check(g >= 15, `pocos nombres guaraníes: ${g}`);
});

// ---------- archivos HTML ----------
const htmlFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (['.git', 'node_modules', 'docs', 'data'].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p); else if (e.endsWith('.html')) htmlFiles.push(p.slice(ROOT.length + 1).replace(/\\/g, '/'));
  }
})(ROOT);
const routeOf = f => f === 'index.html' ? '/' : f.endsWith('/index.html') ? '/' + f.slice(0, -'index.html'.length) : '/' + f;
const sitemap = read('sitemap.xml');
const sitemapRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(SITE.origin, ''));
const indexable = new Set(sitemapRoutes);
const fileFor = href => {
  const clean = href.split('#')[0].split('?')[0];
  const rel = clean.replace(/^\//, '');
  if (clean.endsWith('/')) return join(rel, 'index.html');
  return rel;
};

section('sitemap y rutas', () => {
  check(sitemapRoutes.length > 0, 'sitemap vacío');
  check(new Set(sitemapRoutes).size === sitemapRoutes.length, 'rutas repetidas en sitemap');
  for (const r of sitemapRoutes) {
    check(r.startsWith('/') && r.endsWith('/'), `ruta sin barra final: ${r}`);
    check(existsSync(fileFor(r)), `ruta del sitemap sin archivo: ${r}`);
  }
  const expected = ['/', '/elegir/', GUIDE.route, '/privacidad/', ...LISTS.map(l => l.route), ...NAMES.map(n => `/nombre/${n.slug}/`)];
  for (const r of expected) check(indexable.has(r), `falta en sitemap: ${r}`);
  check(!indexable.has('/mi-lista/'), '/mi-lista/ no debe estar en el sitemap');
  const letters = [...new Set(NAMES.map(n => n.slug[0]))];
  for (const l of letters) check(indexable.has(`/letra/${l}/`), `falta página de letra ${l}`);
  for (const f of htmlFiles) if (!['404.html', 'mi-lista/index.html'].includes(f)) check(indexable.has(routeOf(f)), `HTML fuera del sitemap: ${f}`);
  const robots = read('robots.txt');
  check(robots.includes(`Sitemap: ${SITE.origin}/sitemap.xml`), 'robots.txt sin sitemap');
});

// ---------- assets ----------
const lfHash = p => createHash('sha256').update(read(p).replace(/\r\n/g, '\n')).digest('hex').slice(0, 10);
const binHash = p => createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 10);
const HASH = { '/assets/site.css': lfHash('assets/site.css'), '/assets/app.js': lfHash('assets/app.js'), '/assets/names.json': lfHash('assets/names.json'), '/assets/og.png': binHash('assets/og.png'), '/assets/favicon.svg': lfHash('assets/favicon.svg'), ...Object.fromEntries(['instrument-serif-400.woff2', 'dm-sans-400.woff2', 'dm-sans-700.woff2'].map(f => ['/assets/fonts/' + f, binHash('assets/fonts/' + f)])) };
section('assets', () => {
  const css = statSync('assets/site.css').size, js = statSync('assets/app.js').size;
  check(css < 30 * 1024, `CSS pesa ${css} bytes (>= 30 KB)`);
  check(js < 30 * 1024, `JS pesa ${js} bytes (>= 30 KB)`);
  const data = JSON.parse(read('assets/names.json'));
  check(data.n.length === NAMES.length, 'names.json no coincide con los datos');
  const png = readFileSync('assets/og.png');
  check(png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 630, 'og.png no es 1200x630');
  check(png.length < 200000, 'og.png pesa demasiado');
});

// ---------- páginas ----------
section('páginas HTML (SEO, enlaces, JSON-LD, frases prohibidas)', () => {
  const titles = new Map(), descs = new Map();
  const listRoutes = new Set([...LISTS.map(l => l.route), ...sitemapRoutes.filter(r => r.startsWith('/letra/'))]);
  for (const f of htmlFiles) {
    const html = read(f), route = routeOf(f);
    const isIndexable = indexable.has(route);
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
    const desc = (html.match(/<meta name="description" content="([^"]*)">/) || [])[1];
    const unesc = s => s && s.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    check(html.startsWith('<!doctype html>'), `${f}: sin doctype`);
    check(/<html lang="es-PY">/.test(html), `${f}: lang distinto de es-PY`);
    check((html.match(/<h1[\s>]/g) || []).length === 1, `${f}: debe tener exactamente un h1`);
    check(title && unesc(title).length <= 60, `${f}: title vacío o > 60 (${title && unesc(title).length})`);
    check(desc && unesc(desc).length >= 120 && unesc(desc).length <= 160, `${f}: description fuera de 120-160 (${desc && unesc(desc).length})`);
    if (title) { check(!titles.has(title), `${f}: title repetido con ${titles.get(title)}`); titles.set(title, f); }
    if (desc) { check(!descs.has(desc), `${f}: description repetida con ${descs.get(desc)}`); descs.set(desc, f); }
    check(!FORBIDDEN.test(html), `${f}: frase de popularidad prohibida: ${(html.match(FORBIDDEN) || [])[0]}`);
    check(!/\bundefined\b|\bNaN\b|\[object Object\]/.test(html.replace(/<script[\s\S]*?<\/script>/g, '')), `${f}: texto undefined/NaN`);
    for (const p of ['og:title', 'og:description', 'og:type', 'og:site_name', 'og:locale', 'og:image']) check(html.includes(`property="${p}"`), `${f}: falta ${p}`);
    if (f !== '404.html') {
      const canon = (html.match(/<link rel="canonical" href="([^"]+)">/) || [])[1];
      check(canon === SITE.origin + route, `${f}: canonical incorrecto (${canon})`);
      check(html.includes(`<meta property="og:url" content="${SITE.origin + route}">`), `${f}: og:url incorrecto`);
    }
    if (!isIndexable) check(html.includes('<meta name="robots" content="noindex, follow">'), `${f}: página no indexable sin noindex`);
    else check(!html.includes('noindex'), `${f}: página del sitemap con noindex`);
    // JSON-LD
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
    if (f !== '404.html') check(blocks.length === 1, `${f}: se esperaba un bloque JSON-LD`);
    for (const b of blocks) {
      let data; try { data = JSON.parse(b); } catch (e) { fail(`${f}: JSON-LD inválido: ${e.message}`); continue; }
      const types = (data['@graph'] || [data]).map(x => x['@type']);
      check(types.includes('WebSite') && types.includes('BreadcrumbList'), `${f}: JSON-LD sin WebSite o BreadcrumbList`);
      const crumbs = data['@graph'].find(x => x['@type'] === 'BreadcrumbList');
      check(crumbs.itemListElement.at(-1).item === SITE.origin + route, `${f}: la última miga no es la página`);
      if (listRoutes.has(route)) {
        const il = data['@graph'].find(x => x['@type'] === 'ItemList');
        check(il && il.itemListElement.length > 0, `${f}: falta ItemList`);
        if (il) check(il.itemListElement.length === (html.match(/<li class="card /g) || []).length, `${f}: ItemList no coincide con las tarjetas`);
      }
      const hasFaq = html.includes('class="faq"');
      check(types.includes('FAQPage') === hasFaq, `${f}: FAQPage y sección de FAQ no coinciden`);
      if (hasFaq) {
        const faq = data['@graph'].find(x => x['@type'] === 'FAQPage');
        check(faq.mainEntity.length === (html.match(/<details>/g) || []).length, `${f}: FAQPage no coincide con las preguntas visibles`);
      }
    }
    // enlaces internos y recursos
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:)/.test(href)) {
        if (href.startsWith(SITE.origin)) check(existsSync(fileFor(href.slice(SITE.origin.length))), `${f}: enlace absoluto roto ${href}`);
        continue;
      }
      if (href.startsWith('#')) { check(html.includes(`id="${href.slice(1)}"`), `${f}: ancla inexistente ${href}`); continue; }
      check(href.startsWith('/'), `${f}: enlace relativo ${href}`);
      check(!/\.mjs(\?|$)|^\/(data|docs)\/|^\/\.git/.test(href), `${f}: enlaza a código o datos privados ${href}`);
      const path = href.split('#')[0].split('?')[0];
      if (!path.endsWith('/') && !/\.[a-z0-9]+$/.test(path)) fail(`${f}: URL interna sin barra final ${href}`);
      check(existsSync(fileFor(href)), `${f}: enlace interno roto ${href}`);
      const v = href.match(/^(\/assets\/[^?]+)\?v=([a-f0-9]+)$/);
      if (v) check(HASH[v[1]] === v[2], `${f}: hash de ${v[1]} desactualizado`);
      else if (path.startsWith('/assets/')) fail(`${f}: asset sin ?v= ${href}`);
    }
    for (const m of html.matchAll(/data-names="([^"]+)"/g)) check(m[1] === `/assets/names.json?v=${HASH['/assets/names.json']}`, `${f}: data-names desactualizado`);
    for (const m of html.matchAll(/content="(https:\/\/nombres\.com\.py\/assets\/og\.png\?v=[^"]+)"/g)) check(m[1].endsWith(HASH['/assets/og.png']), `${f}: og:image desactualizado`);
    // corazones: todos con aria-pressed
    for (const m of html.matchAll(/<button type="button" class="fav[^"]*"([^>]*)>/g)) check(/aria-pressed="(true|false)"/.test(m[1]) && /aria-label="/.test(m[1]), `${f}: botón de favorito sin aria-pressed/aria-label`);
    // inputs con label
    for (const m of html.matchAll(/<(?:input|select)[^>]*\bid="([^"]+)"/g)) check(html.includes(`for="${m[1]}"`), `${f}: campo ${m[1]} sin label`);
  }
});

// ---------- contenido ----------
section('contenido (intros, guía, nombres, cruce con babyshower)', () => {
  for (const l of LISTS) {
    const html = read(fileFor(l.route));
    const intro = (html.match(/<div class="intro" data-intro>([\s\S]*?)<\/div>/) || [])[1] || '';
    const w = words(intro);
    check(w >= 150 && w <= 250, `${l.route}: intro de ${w} palabras (150-250)`);
    check(l.faq.length >= 3 && l.faq.length <= 5, `${l.route}: se esperaban 3-5 FAQ`);
    check(html.includes('href="https://babyshower.com.py/"') && html.includes('href="https://babyshower.com.py/revelacion-de-genero/"'), `${l.route}: falta bloque babyshower`);
  }
  for (const r of ['/', GUIDE.route]) {
    const html = read(fileFor(r));
    check(html.includes('href="https://babyshower.com.py/revelacion-de-genero/"'), `${r}: falta bloque babyshower`);
  }
  const guide = read(fileFor(GUIDE.route));
  const art = (guide.match(/<article class="guide" data-guide>([\s\S]*?)<\/article>/) || [])[1] || '';
  const gw = words(art);
  check(gw >= 900 && gw <= 1200, `guía de ${gw} palabras (900-1200)`);
  check(/Registro Civil/.test(art), 'la guía debe remitir al Registro Civil');
  for (const n of NAMES) {
    const html = read(`nombre/${n.slug}/index.html`);
    check(((html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '') === `${n.name.replace(/&/g, '&amp;')}: significado y origen del nombre`, `${n.slug}: h1 incorrecto`);
    check((html.match(/<section aria-labelledby="rel-h">[\s\S]*?<\/section>/)[0].match(/<li class="card /g) || []).length === 6, `${n.slug}: se esperaban 6 nombres parecidos`);
    check(html.includes('Cómo combina'), `${n.slug}: falta Cómo combina`);
    if (n.saint) check(html.includes(n.saint), `${n.slug}: falta santo`);
  }
  const home = read('index.html');
  check(home.includes('data-tool') && home.includes('data-tool-results'), 'inicio sin herramienta');
  const ml = read('mi-lista/index.html');
  for (const hook of ['data-shared', 'data-my-list', 'data-share-url', 'data-wa', 'data-apellido', 'data-duel-start']) check(ml.includes(hook), `mi-lista sin ${hook}`);
});

// ---------- .htaccess ----------
section('.htaccess', () => {
  const h = read('.htaccess');
  for (const [re, m] of [
    [/ErrorDocument 404 \/404\.html/, 'ErrorDocument 404'],
    [/\\\.\(mjs\|md\|log\)\$/, 'bloqueo de .mjs'],
    [/\^\(data\|docs\|node_modules\)/, 'bloqueo de data/ y docs/'],
    [/RewriteRule \(\^\|\/\)\\\. - \[F/, 'bloqueo de archivos ocultos (.git)'],
    [/mod_deflate/, 'gzip'], [/mod_brotli/, 'brotli'],
    [/max-age=31536000, immutable.*assets/, 'caché larga de /assets'],
    [/\.html\$"\>[\s\S]*max-age=300/, 'caché corta de HTML'],
  ]) check(re.test(h), `.htaccess sin ${m}`);
});

console.log(`\n${checks} comprobaciones, ${htmlFiles.length} HTML, ${NAMES.length} nombres.`);
if (failures.length) {
  console.log(`\nFAIL (${failures.length}):`);
  for (const f of failures.slice(0, 80)) console.log(' - ' + f);
  if (failures.length > 80) console.log(` ... y ${failures.length - 80} más`);
  process.exit(1);
}
console.log('PASS');
