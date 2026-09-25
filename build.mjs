// node build.mjs  ->  genera el sitio estático en la raíz del repo.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { NAMES, TAGS } from './data/names.mjs';
import * as C from './content.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
process.chdir(ROOT);
const { SITE } = C;

// ---------- utilidades ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fold = s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const collator = new Intl.Collator('es', { sensitivity: 'base' });
const byName = (a, b) => collator.compare(a.name, b.name) || a.slug.localeCompare(b.slug);
const fnv = s => { let h = 0x811c9dc5; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h; };
const lfHash = path => createHash('sha256').update(readFileSync(path, 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 10);
const binHash = path => createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 10);
const url = route => SITE.origin + route;
const written = [];
function out(route, html) {
  const file = route === '/' ? 'index.html' : route.endsWith('/') ? join(route.slice(1), 'index.html') : route.slice(1);
  mkdirSync(dirname(join(ROOT, file)) || '.', { recursive: true });
  writeFileSync(join(ROOT, file), html.replace(/\r\n/g, '\n'));
  written.push(file);
}
function fit(base, tails, min = 120, max = 160) {
  for (const t of tails) { const s = base + t; if (s.length >= min && s.length <= max) return s; }
  // base demasiado larga: recorta la base en una palabra y agrega la cola más corta.
  const tail = tails[tails.length - 1];
  let b = base;
  while ((b + '…' + tail).length > max) b = b.slice(0, b.lastIndexOf(' '));
  return (b.replace(/[,;:.]$/, '') + '…' + tail);
}
const words = s => s.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

// ---------- limpieza de salidas anteriores ----------
const LIST_ROUTES = C.LISTS.map(l => l.route);
const OWNED = ['nombre', 'letra', 'elegir', 'mi-lista', 'privacidad', C.GUIDE.route.slice(1, -1), ...LIST_ROUTES.map(r => r.slice(1, -1))];
for (const d of OWNED) rmSync(join(ROOT, d), { recursive: true, force: true });

// ---------- datos derivados ----------
const SORTED = [...NAMES].sort(byName);
const BY_SLUG = new Map(NAMES.map(n => [n.slug, n]));
const letterOf = n => n.slug[0];
const LETTERS = [...new Set(SORTED.map(letterOf))].sort();
const ORIGINS = [...new Set(NAMES.flatMap(n => n.origin.split(' y ')))].sort(collator.compare);
const TAG_ROUTE = { guarani: '/nombres-guaranies/', corto: '/nombres-cortos/', compuesto: '/nombres-compuestos/', biblico: '/nombres-biblicos/', clasico: '/nombres-clasicos/', moderno: '/nombres-modernos/', unisex: '/nombres-unisex/' };
const GENDER_ROUTE = { f: '/nombres-de-nina/', m: '/nombres-de-varon/', u: '/nombres-unisex/' };
const GENDER_LIST_NAME = { f: 'Nombres de niña', m: 'Nombres de varón', u: 'Nombres unisex' };
const matches = (n, f) => (f.gender ? n.gender === f.gender : true) && (f.tag ? n.tags.includes(f.tag) : true);

// ---------- assets ----------
mkdirSync('assets', { recursive: true });
const json = { tags: TAGS, n: SORTED.map(n => [n.slug, n.name, n.gender, n.origin, n.meaning, n.tags.map(t => TAGS.indexOf(t)).join('')]) };
writeFileSync('assets/names.json', JSON.stringify(json));
writeFileSync('assets/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#a84a26"/><path fill="#fbf6f0" d="M32 50s-15-9.2-19.2-18.6C10 24.6 14 17 21.2 17c4.2 0 7.2 2.4 8.8 5.2 1.6-2.8 4.6-5.2 8.8-5.2C46 17 50 24.6 47.2 31.4 43 40.8 32 50 32 50z"/></svg>\n');
writeOgPng('assets/og.png');
const V = {
  css: lfHash('assets/site.css'), js: lfHash('assets/app.js'),
  json: lfHash('assets/names.json'), og: binHash('assets/og.png'), ico: lfHash('assets/favicon.svg'),
};
// Self-hosted OFL fonts (licences in assets/fonts); inline @font-face so preload and CSS share the hashed URL.
const FONT = f => `/assets/fonts/${f}?v=${binHash('assets/fonts/' + f)}`;
const FONT_HEAD = `<link rel="preload" href="${FONT('instrument-serif-400.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${FONT('dm-sans-400.woff2')}" as="font" type="font/woff2" crossorigin>
<style>@font-face{font-family:'Instrument Serif';font-weight:400;font-display:swap;src:url('${FONT('instrument-serif-400.woff2')}') format('woff2')}@font-face{font-family:'DM Sans';font-weight:400;font-display:swap;src:url('${FONT('dm-sans-400.woff2')}') format('woff2')}@font-face{font-family:'DM Sans';font-weight:700;font-display:swap;src:url('${FONT('dm-sans-700.woff2')}') format('woff2')}</style>`;

// ---------- piezas de HTML ----------
const HEART = '<svg class="sprite" aria-hidden="true" focusable="false"><symbol id="h" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></symbol></svg>';
const favBtn = n => `<button type="button" class="fav" data-slug="${n.slug}" data-name="${esc(n.name)}" aria-pressed="false" aria-label="Guardar ${esc(n.name)} en mi lista" hidden><svg aria-hidden="true" focusable="false"><use href="#h"/></svg></button>`;
const originText = o => o.replace(' y ', ' y ');
const card = n => `<li class="card g-${n.gender}"><a class="card-link" href="/nombre/${n.slug}/"><span class="card-name">${esc(n.name)}</span><span class="card-mean">${esc(n.meaning)}</span><span class="card-meta">${esc(originText(n.origin))} · ${C.GENDER_LABEL[n.gender]}</span></a>${favBtn(n)}</li>`;
const cards = list => `<ul class="cards">${list.map(card).join('')}</ul>`;
const azBar = (current) => `<nav class="az" aria-label="Nombres por letra inicial"><ul>${'abcdefghijklmnopqrstuvwxyz'.split('').map(l => LETTERS.includes(l) ? `<li><a href="/letra/${l}/"${l === current ? ' aria-current="page"' : ''}>${l.toUpperCase()}</a></li>` : `<li><span aria-hidden="true">${l.toUpperCase()}</span></li>`).join('')}</ul></nav>`;
const faqHtml = faq => `<section class="faq" aria-labelledby="faq-h"><h2 id="faq-h">Preguntas frecuentes</h2>${faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`;
const bsBlock = (name) => `<aside class="bs" aria-label="Baby shower"><div class="bs-copy"><p class="bs-kicker">babyshower.com.py</p><p class="bs-title">${name ? `¿${esc(name)} es el nombre elegido? Anuncialo en el baby shower` : '¿Ya tienen el nombre? Anuncialo en el baby shower'}</p><p>${C.BS_TEXT} Decoración, mesa dulce y cartel con el nombre en Asunción y Gran Asunción, con precios estimados a la vista.</p></div><div class="bs-actions"><a class="btn" href="${C.BABYSHOWER.home}">Ver combos de baby shower</a><a class="btn btn-ghost" href="${C.BABYSHOWER.reveal}">Revelación de género</a><a class="btn btn-ghost" href="${C.BABYSHOWER.welcome}">Bienvenida de bebé</a></div></aside>`;
const crumbsHtml = crumbs => `<nav class="crumbs" aria-label="Ruta"><ol>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.route}">${esc(c.name)}</a></li>`).join('')}</ol></nav>`;
const listLinks = (exclude) => `<nav class="lists" aria-label="Listas de nombres"><ul>${C.LISTS.filter(l => l.route !== exclude).map(l => `<li><a href="${l.route}">${esc(l.short)}</a></li>`).join('')}</ul></nav>`;

const TOOL = (action) => `
<form class="tool" data-tool action="${action}" method="get" role="search" hidden>
  <div class="field field-q"><label for="q">Buscá un nombre</label><input id="q" name="q" type="search" autocomplete="off" spellcheck="false" placeholder="Ej.: ara, sofi, mateo"></div>
  <div class="field"><label for="f-g">Género</label><select id="f-g" name="g"><option value="">Todos</option><option value="f">Niña</option><option value="m">Varón</option><option value="u">Unisex</option></select></div>
  <div class="field"><label for="f-o">Origen</label><select id="f-o" name="o"><option value="">Todos</option>${ORIGINS.map(o => `<option value="${esc(o)}">${esc(o[0].toUpperCase() + o.slice(1))}</option>`).join('')}</select></div>
  <div class="field"><label for="f-t">Estilo</label><select id="f-t" name="t"><option value="">Todos</option>${TAGS.map(t => `<option value="${t}">${C.TAG_LABEL[t]}</option>`).join('')}</select></div>
  <div class="field"><label for="f-l">Letra inicial</label><select id="f-l" name="l"><option value="">Todas</option>${LETTERS.map(l => `<option value="${l}">${l.toUpperCase()}</option>`).join('')}</select></div>
  <div class="field"><label for="f-n">Largo máximo</label><select id="f-n" name="n"><option value="">Cualquiera</option><option value="4">Hasta 4 letras</option><option value="5">Hasta 5 letras</option><option value="6">Hasta 6 letras</option><option value="8">Hasta 8 letras</option></select></div>
  <button type="reset" class="btn btn-ghost">Limpiar filtros</button>
</form>
<p class="tool-count" data-tool-count aria-live="polite"></p>`;
const MINI = `<aside class="mini" data-mini hidden aria-labelledby="mini-h"><h2 id="mini-h">Mi lista</h2><p data-mini-empty>Todavía no guardaste nombres. Tocá el corazón de cualquier tarjeta.</p><ul class="chips" data-mini-list></ul><p><a class="btn" href="/mi-lista/">Abrir mi lista, probar apellidos y duelo</a></p></aside>`;

function jsonLd(page) {
  const graph = [
    { '@type': 'WebSite', '@id': SITE.origin + '/#website', name: SITE.name, url: SITE.origin + '/', inLanguage: SITE.lang },
    { '@type': 'BreadcrumbList', itemListElement: page.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: url(c.route) })) },
  ];
  if (page.itemList) graph.push({ '@type': 'ItemList', name: page.h1, numberOfItems: page.itemList.length, itemListElement: page.itemList.map((n, i) => ({ '@type': 'ListItem', position: i + 1, name: n.name, url: url(`/nombre/${n.slug}/`) })) });
  if (page.faq) graph.push({ '@type': 'FAQPage', mainEntity: page.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

function layout(page) {
  const canonical = page.route ? url(page.route) : null;
  return `<!doctype html>
<html lang="${SITE.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${canonical ? `<link rel="canonical" href="${canonical}">\n` : ''}${page.noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
${canonical ? `<meta property="og:url" content="${canonical}">\n` : ''}<meta property="og:image" content="${SITE.origin}/assets/og.png?v=${V.og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="nombres.com.py, nombres de bebé para Paraguay">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#fbf6f0">
<link rel="icon" href="/assets/favicon.svg?v=${V.ico}" type="image/svg+xml">
${FONT_HEAD}
<link rel="stylesheet" href="/assets/site.css?v=${V.css}">
${page.crumbs ? `<script type="application/ld+json">${jsonLd(page)}</script>\n` : ''}<script src="/assets/app.js?v=${V.js}" defer></script>
</head>
<body data-names="/assets/names.json?v=${V.json}"${page.bodyAttr ? ' ' + page.bodyAttr : ''}>
${HEART}
<a class="skip" href="#main">Saltar al contenido</a>
<header class="site-header"><div class="wrap hdr">
<a class="brand" href="/"><svg class="brand-mark" viewBox="0 0 24 24" aria-hidden="true"><use href="#h"/></svg>nombres<span>.com.py</span></a>
<nav class="nav" aria-label="Principal"><ul>
<li><a href="/nombres-de-nina/"${page.route === '/nombres-de-nina/' ? ' aria-current="page"' : ''}>Niña</a></li><li><a href="/nombres-de-varon/"${page.route === '/nombres-de-varon/' ? ' aria-current="page"' : ''}>Varón</a></li><li><a href="/nombres-guaranies/"${page.route === '/nombres-guaranies/' ? ' aria-current="page"' : ''}>Guaraníes</a></li><li><a href="/nombres-unisex/"${page.route === '/nombres-unisex/' ? ' aria-current="page"' : ''}>Unisex</a></li><li><a href="/elegir/"${page.route === '/elegir/' ? ' aria-current="page"' : ''}>Buscador</a></li><li><a href="${C.GUIDE.route}"${page.route === C.GUIDE.route ? ' aria-current="page"' : ''}>Cómo elegir</a></li>
</ul></nav>
<a class="hdr-list" href="/mi-lista/"><svg aria-hidden="true" viewBox="0 0 24 24"><use href="#h"/></svg>Mi lista <span class="count" data-fav-count>0</span></a>
</div></header>
<main id="main" class="wrap">
${page.crumbs && page.crumbs.length > 1 ? crumbsHtml(page.crumbs) : ''}
${page.body}
</main>
<footer class="site-footer"><div class="wrap">
<div class="foot-top"><a class="brand brand-foot" href="/">nombres<span>.com.py</span></a><p>Nombres de bebé para familias paraguayas, con significado, origen y herramientas para decidir en pareja.</p></div>
<nav aria-label="Pie de página"><ul>
${C.LISTS.map(l => `<li><a href="${l.route}">${esc(l.h1)}</a></li>`).join('\n')}
<li><a href="/elegir/">Buscador de nombres</a></li>
<li><a href="${C.GUIDE.route}">Cómo elegir el nombre</a></li>
<li><a href="/privacidad/">Privacidad</a></li>
</ul></nav>
<p>${C.BS_TEXT} Mirá ideas y combos en <a href="${C.BABYSHOWER.home}">babyshower.com.py</a>.</p>
<p class="fine">nombres.com.py · Significados según la etimología más difundida. No publicamos listas por cantidad de bebés ni datos de nacimientos.</p>
</div></footer>
</body>
</html>
`;
}

const routes = []; // indexables, para el sitemap
function page(p) { out(p.route, layout(p)); if (!p.noindex) routes.push(p.route); }
const HOME_CRUMB = { name: 'Inicio', route: '/' };

// ---------- inicio ----------
{
  const starters = [...NAMES.filter(n => n.gender === 'f').slice(0, 8), ...NAMES.filter(n => n.gender === 'm').slice(0, 8), ...NAMES.filter(n => n.tags.includes('guarani')).slice(0, 4)];
  const listCards = C.LISTS.map(l => `<li><a href="${l.route}"><strong>${esc(l.h1)}</strong><span>${NAMES.filter(n => matches(n, l.filter)).length} nombres</span></a></li>`).join('');
  page({
    route: '/', title: C.HOME.title, description: C.HOME.description, h1: C.HOME.h1, crumbs: [HOME_CRUMB], faq: C.HOME.faq,
    body: `<section class="hero"><div class="hero-copy"><p class="kicker">Nombres de bebé · Paraguay</p><h1>${esc(C.HOME.h1)}</h1><p class="lead">${esc(C.HOME.lead)}</p><p class="hero-cta"><a class="btn" href="/nombres-de-nina/">Nombres de niña</a><a class="btn" href="/nombres-de-varon/">Nombres de varón</a><a class="btn btn-ghost" href="/nombres-guaranies/">Guaraníes</a></p><ul class="stats"><li><strong>${NAMES.length}</strong> nombres</li><li><strong>${NAMES.filter(n => n.tags.includes('guarani')).length}</strong> guaraníes</li><li><strong>${LETTERS.length}</strong> letras</li></ul></div><div class="hero-art" aria-hidden="true">${['arami', 'mateo', 'jasy', 'sofia', 'yvoty', 'santiago'].map(s => NAMES.find(n => n.slug === s)).filter(Boolean).map((n, i) => `<div class="tile t${i}"><span class="tile-name">${esc(n.name)}</span><span class="tile-mean">${esc(n.meaning.split(/[.(;]/)[0])}</span></div>`).join('')}</div></section>
<section class="tool-wrap" aria-labelledby="tool-h"><h2 id="tool-h">Buscá y guardá nombres</h2>
<noscript><p class="note">Para usar los filtros y guardar favoritos activá JavaScript. Igual podés recorrer todas las listas de abajo.</p></noscript>
${TOOL('/elegir/')}
<div data-tool-results><p class="sub">Algunas ideas para empezar:</p>${cards(starters)}</div>
<p><a class="btn" href="/elegir/">Ver el buscador completo</a></p>
${MINI}
</section>
<section aria-labelledby="lists-h"><h2 id="lists-h">Explorá por lista</h2><ul class="list-cards">${listCards}</ul>
<h3>Por letra inicial</h3>${azBar()}</section>
<section class="guide-mini" aria-labelledby="g-h"><h2 id="g-h">Cómo elegir el nombre de tu bebé</h2>
<div class="grid2">${C.HOME.guide.map(g => `<div><h3>${esc(g.h)}</h3><p>${esc(g.p)}</p></div>`).join('')}</div>
<p><a href="${C.GUIDE.route}">Leé la guía completa para elegir el nombre en Paraguay</a></p></section>
${bsBlock()}
${faqHtml(C.HOME.faq)}`,
  });
}

// ---------- buscador ----------
page({
  route: '/elegir/', title: C.ELEGIR.title, description: C.ELEGIR.description, h1: C.ELEGIR.h1, bodyAttr: 'data-tool-auto',
  crumbs: [HOME_CRUMB, { name: 'Elegí el nombre', route: '/elegir/' }],
  body: `<h1>${esc(C.ELEGIR.h1)}</h1><p class="lead">${esc(C.ELEGIR.lead)}</p>
<noscript><p class="note">Para usar los filtros y guardar favoritos activá JavaScript. Abajo tenés todos los nombres en orden alfabético.</p></noscript>
${TOOL('/elegir/')}
<div data-tool-results><ul class="all-names">${SORTED.map(n => `<li><a href="/nombre/${n.slug}/">${esc(n.name)}</a></li>`).join('')}</ul></div>
${MINI}
${listLinks()}`,
});

// ---------- mi lista ----------
page({
  route: '/mi-lista/', title: C.MI_LISTA.title, description: C.MI_LISTA.description, h1: C.MI_LISTA.h1, noindex: true,
  crumbs: [HOME_CRUMB, { name: 'Mi lista', route: '/mi-lista/' }],
  body: `<h1 data-ml-title>${esc(C.MI_LISTA.h1)}</h1>
<noscript><p class="note">Mi lista funciona con JavaScript y guarda los nombres sólo en este navegador. Activalo para ver tus favoritos.</p></noscript>
<section data-shared hidden aria-labelledby="sh-h"><h2 id="sh-h">Lista compartida</h2><p data-shared-winner class="winner" hidden></p><p>Estos son los nombres que te compartieron. Tocá el corazón para sumarlos a tu propia lista.</p><ul class="cards" data-shared-list></ul><p><button type="button" class="btn" data-save-all>Guardar todos en mi lista</button> <a class="btn btn-ghost" href="/mi-lista/">Ver mi lista</a></p></section>
<section data-mine hidden aria-labelledby="mine-h"><h2 id="mine-h">Tus favoritos</h2>
<p data-empty>Todavía no guardaste nombres. Recorré <a href="/nombres-de-nina/">nombres de niña</a>, <a href="/nombres-de-varon/">nombres de varón</a> o el <a href="/elegir/">buscador</a> y tocá el corazón.</p>
<ul class="cards" data-my-list></ul>
<div class="panel" data-share-box hidden><h3>Compartir mi lista</h3><p>Mandale este enlace a tu pareja o a la familia: van a ver tus nombres sin poder cambiarlos.</p>
<label for="share-url">Enlace de tu lista</label><input id="share-url" type="text" readonly data-share-url>
<p class="row"><button type="button" class="btn" data-copy>Copiar enlace</button> <a class="btn btn-wa" data-wa href="https://wa.me/" target="_blank" rel="noopener">Compartir por WhatsApp</a></p></div>
</section>
<section class="panel" data-apellido hidden aria-labelledby="ap-h"><h2 id="ap-h">Probá con tu apellido</h2><p>Escribí uno o dos apellidos y mirá cómo queda cada favorito con el nombre completo. Los apellidos se guardan sólo en este navegador.</p>
<div class="grid2"><div class="field"><label for="ap1">Primer apellido</label><input id="ap1" type="text" autocomplete="off" data-ap1 placeholder="Ej.: Benítez"></div><div class="field"><label for="ap2">Segundo apellido (opcional)</label><input id="ap2" type="text" autocomplete="off" data-ap2 placeholder="Ej.: Villalba"></div></div>
<ul class="fullnames" data-fullnames></ul></section>
<section class="panel" data-duel hidden aria-labelledby="duel-h"><h2 id="duel-h">Duelo de nombres</h2><p data-duel-help>Elegí entre dos favoritos por vez. El ganador sigue en juego contra el próximo, hasta que queda uno solo.</p>
<p><button type="button" class="btn" data-duel-start>Empezar el duelo</button></p>
<div data-duel-stage hidden><p class="duel-round" data-duel-round aria-live="polite"></p><div class="duel-pair"><button type="button" class="duel-opt" data-duel-a></button><span class="duel-vs" aria-hidden="true">o</span><button type="button" class="duel-opt" data-duel-b></button></div></div>
<div data-duel-result hidden><p class="winner" data-duel-winner aria-live="polite"></p><p class="row"><a class="btn btn-wa" data-duel-wa href="https://wa.me/" target="_blank" rel="noopener">Compartir el resultado</a> <button type="button" class="btn btn-ghost" data-duel-start>Jugar de nuevo</button></p></div>
</section>`,
});

// ---------- listas ----------
for (const l of C.LISTS) {
  const list = SORTED.filter(n => matches(n, l.filter));
  page({
    route: l.route, title: l.title, description: l.description, h1: l.h1, faq: l.faq, itemList: list,
    crumbs: [HOME_CRUMB, { name: l.h1, route: l.route }],
    body: `<h1>${esc(l.h1)}</h1>
<div class="intro" data-intro>${l.intro.map(p => `<p>${esc(p)}</p>`).join('')}</div>
${listLinks(l.route)}
<h2>${list.length} nombres en esta lista</h2>
${cards(list)}
<p><a class="btn" href="/elegir/">Filtrar con el buscador</a> <a class="btn btn-ghost" href="/mi-lista/">Ver mi lista</a></p>
${azBar()}
${bsBlock()}
${faqHtml(l.faq)}`,
  });
}

// ---------- letras ----------
for (const L of LETTERS) {
  const list = SORTED.filter(n => letterOf(n) === L);
  const U = L.toUpperCase();
  const groups = [['f', 'Niñas'], ['m', 'Varones'], ['u', 'Unisex']].map(([g, label]) => [label, list.filter(n => n.gender === g)]).filter(([, a]) => a.length);
  const ex = list.slice(0, 3).map(n => n.name);
  const exText = ex.length > 1 ? ex.slice(0, -1).join(', ') + ' y ' + ex[ex.length - 1] : ex[0];
  page({
    route: `/letra/${L}/`, title: `Nombres con ${U} para bebé: niñas y varones`,
    description: fit(`Nombres de bebé que empiezan con ${U}, con significado y origen, como ${exText}.`, [
      ' Separados por niña, varón y unisex para que compares rápido; guardá tus favoritos.',
      ' Separados por niña, varón y unisex; guardá tus favoritos y probalos con tu apellido.',
      ' Separados por niña y varón; guardá tus favoritos y probalos con tu apellido.',
      ' Guardá tus favoritos y probalos con tu apellido.', ' Guardá tus favoritos.']),
    h1: `Nombres con ${U}`, itemList: list,
    crumbs: [HOME_CRUMB, { name: `Letra ${U}`, route: `/letra/${L}/` }],
    body: `<h1>Nombres de bebé con ${U}</h1><p class="lead">Nombres que empiezan con ${U}, con su significado y origen, separados por niña, varón y unisex.</p>
${azBar(L)}
${groups.map(([label, a]) => `<h2>${label} con ${U}</h2>${cards(a)}`).join('\n')}
${listLinks()}`,
  });
}

// ---------- fichas de nombre ----------
const tagSentence = n => {
  const bits = [];
  if (n.tags.includes('clasico')) bits.push('clásico');
  if (n.tags.includes('moderno')) bits.push('de estilo moderno');
  if (n.tags.includes('biblico')) bits.push('bíblico');
  if (n.tags.includes('guarani')) bits.push('guaraní');
  if (n.tags.includes('corto')) bits.push('corto');
  if (n.tags.includes('compuesto')) bits.push('compuesto');
  if (!bits.length) return '';
  const t = bits.length > 1 ? bits.slice(0, -1).join(', ') + ' y ' + bits[bits.length - 1] : bits[0];
  return `Es un nombre ${t}.`;
};
function related(n) {
  const pool = NAMES.filter(o => o.slug !== n.slug && (o.gender === n.gender || o.gender === 'u' || n.gender === 'u'));
  const score = o => (o.origin === n.origin ? 3 : 0) + o.tags.filter(t => n.tags.includes(t) && t !== 'corto').length + (o.gender === n.gender ? 1 : 0);
  return pool.map(o => [score(o), fnv(n.slug + '|' + o.slug), o]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).slice(0, 6).map(x => x[2]);
}
for (const n of NAMES) {
  const h = fnv(n.slug);
  const A = C.APELLIDOS, pick = k => A[(h >>> (k * 4)) % A.length];
  const aps = []; for (let k = 0; aps.length < 6 && k < 8; k++) { const a = pick(k); if (!aps.includes(a)) aps.push(a); }
  while (aps.length < 6) aps.push(A.find(a => !aps.includes(a)));
  const samples = [`${n.name} ${aps[0]}`, `${n.name} ${aps[1]} ${aps[2]}`, `${n.name} ${aps[3]}`, `${n.name} ${aps[4]} ${aps[5]}`];
  const g = { f: 'de niña', m: 'de varón', u: 'unisex' }[n.gender];
  const rel = related(n);
  const gl = GENDER_ROUTE[n.gender];
  const dl = [
    ['Significado', esc(n.meaning)],
    ['Origen', esc(n.origin[0].toUpperCase() + n.origin.slice(1))],
    ['Género', `<a href="${gl}">${n.gender === 'u' ? 'Unisex (niña o varón)' : n.gender === 'f' ? 'Niña' : 'Varón'}</a>`],
    n.saint && ['Santo', esc(n.saint)],
    n.variants && ['Variantes', esc(n.variants.join(', '))],
  ].filter(Boolean);
  const tagLinks = n.tags.map(t => TAG_ROUTE[t] ? `<li><a href="${TAG_ROUTE[t]}">${C.TAG_LABEL[t]}</a></li>` : `<li><span>${C.TAG_LABEL[t]}</span></li>`).join('');
  const title = `${n.name}: significado y origen del nombre`;
  const base = `${n.name}, nombre ${g} de origen ${n.origin}. Significado: ${n.meaning.replace(/\.$/, '')}.`;
  const description = fit(base, [
    n.saint ? ` Santo: ${n.saint}. Variantes, cómo combina con apellidos y nombres parecidos.` : ' Mirá variantes, cómo combina con apellidos paraguayos y nombres parecidos.',
    ' Mirá cómo combina con apellidos paraguayos y nombres parecidos para comparar.',
    ' Mirá cómo combina con apellidos paraguayos y nombres parecidos.',
    ' Cómo combina con apellidos y nombres parecidos.',
    ' Probalo con tu apellido.', '',
  ]);
  page({
    route: `/nombre/${n.slug}/`, title, description, h1: title, ogType: 'article',
    crumbs: [HOME_CRUMB, { name: GENDER_LIST_NAME[n.gender], route: gl }, { name: n.name, route: `/nombre/${n.slug}/` }],
    body: `<article class="name-page g-${n.gender}">
<header class="name-head"><div><p class="kicker">Nombre ${g} · origen ${esc(n.origin)}</p><h1><span class="big-name">${esc(n.name)}</span><span class="h1-rest"><span class="vh">: </span>significado y origen del nombre</span></h1><p class="big-mean">${esc(n.meaning)}</p></div>${favBtn(n).replace('class="fav"', 'class="fav fav-lg"')}</header>
<p class="lead">${esc(n.name)} es un nombre ${g} de origen ${esc(n.origin)}. ${esc(n.meaning)} ${tagSentence(n)}</p>
<dl class="facts">${dl.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
${n.note ? `<p class="note">${esc(n.note)}</p>` : ''}
<ul class="tags" aria-label="Etiquetas">${tagLinks}</ul>
<section aria-labelledby="combina-h"><h2 id="combina-h">Cómo combina</h2><p>Así se ve ${esc(n.name)} con algunos apellidos paraguayos, con uno y con dos apellidos:</p>
<ul class="fullnames">${samples.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
<p>¿Querés verlo con tu apellido? Guardalo con el corazón y abrí <a href="/mi-lista/">Mi lista</a> para probarlo.</p></section>
<section aria-labelledby="rel-h"><h2 id="rel-h">Nombres parecidos a ${esc(n.name)}</h2>${cards(rel)}</section>
<p class="more"><a href="/letra/${letterOf(n)}/">Más nombres con ${letterOf(n).toUpperCase()}</a> · <a href="${gl}">${GENDER_LIST_NAME[n.gender]}</a>${n.tags.includes('guarani') ? ' · <a href="/nombres-guaranies/">Nombres guaraníes</a>' : ''}</p>
</article>
${bsBlock(n.name)}`,
  });
}

// ---------- guía ----------
page({
  route: C.GUIDE.route, title: C.GUIDE.title, description: C.GUIDE.description, h1: C.GUIDE.h1, faq: C.GUIDE.faq, ogType: 'article',
  crumbs: [HOME_CRUMB, { name: 'Cómo elegir el nombre', route: C.GUIDE.route }],
  body: `<article class="guide" data-guide><h1>${esc(C.GUIDE.h1)}</h1>
${C.GUIDE.sections.map(s => `${s.h ? `<h2>${esc(s.h)}</h2>` : ''}${s.p.map(p => `<p>${esc(p)}</p>`).join('')}`).join('\n')}
</article>
${listLinks()}
${bsBlock()}
${faqHtml(C.GUIDE.faq)}`,
});

// ---------- privacidad ----------
page({
  route: '/privacidad/', title: C.PRIVACY.title, description: C.PRIVACY.description, h1: C.PRIVACY.h1,
  crumbs: [HOME_CRUMB, { name: 'Privacidad', route: '/privacidad/' }],
  body: `<article class="guide"><h1>${esc(C.PRIVACY.h1)}</h1>${C.PRIVACY.p.map(p => `<p>${esc(p)}</p>`).join('')}</article>`,
});

// ---------- 404 ----------
out('/404.html', layout({
  route: null, title: C.NOT_FOUND.title, description: C.NOT_FOUND.description, noindex: true,
  body: `<h1>${esc(C.NOT_FOUND.h1)}</h1><p class="lead">La dirección no existe o cambió. Probá con alguna de estas listas o con el <a href="/elegir/">buscador de nombres</a>.</p>${listLinks()}${azBar()}`,
}));

// ---------- sitemap, robots, htaccess ----------
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(r => `<url><loc>${url(r)}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`);
writeFileSync('.htaccess', `# Generado por build.mjs. Hostinger sirve la raíz del repo tal cual.
Options -Indexes
DirectoryIndex index.html
AddDefaultCharset UTF-8
ErrorDocument 404 /404.html
ErrorDocument 403 /404.html

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} ^www\\. [NC]
RewriteCond %{HTTP_HOST} ^(?:www\\.)?nombres\\.com\\.py$ [NC]
RewriteRule ^ https://nombres.com.py%{REQUEST_URI} [R=301,L,NE]

# Código fuente, datos y documentación no son públicos.
RewriteCond %{REQUEST_URI} !^/\\.well-known/
RewriteRule (^|/)\\. - [F,L]
RewriteRule ^(data|docs|node_modules)(/|$) - [F,L,NC]
RewriteRule \\.(mjs|md|log)$ - [F,L,NC]
</IfModule>

<FilesMatch "(?i)\\.(mjs|md|log)$">
  Require all denied
</FilesMatch>

<IfModule mod_mime.c>
  AddType image/svg+xml .svg
  AddType application/json .json
</IfModule>

<IfModule mod_headers.c>
  # Los assets llevan ?v=<hash>; el HTML se revalida seguido.
  Header set Cache-Control "public, max-age=31536000, immutable" "expr=%{REQUEST_URI} =~ m#^/assets/#"
  <FilesMatch "(?i)\\.html$">
    Header set Cache-Control "public, max-age=300, must-revalidate"
  </FilesMatch>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/plain text/xml application/javascript text/javascript application/json application/xml application/ld+json image/svg+xml
</IfModule>
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript text/javascript application/json application/xml application/ld+json image/svg+xml
</IfModule>
`);
writeFileSync('docs/routes.json', JSON.stringify({ indexable: routes, noindex: ['/mi-lista/', '/404.html'] }, null, 1) + '\n');

console.log(`build: ${written.length} HTML, ${routes.length} rutas en sitemap, ${NAMES.length} nombres, assets v css=${V.css} js=${V.js} json=${V.json}`);

// ---------- og.png sin dependencias (1200x630, RGB) ----------
function writeOgPng(path) {
  const W = 1200, H = 630, px = new Float32Array(W * H * 3);
  const bg = [251, 246, 240];
  for (let i = 0; i < W * H; i++) px.set(bg, i * 3);
  const blend = (x, y, c, a) => { if (x < 0 || y < 0 || x >= W || y >= H || a <= 0) return; const i = (y * W + x) * 3; for (let k = 0; k < 3; k++) px[i + k] = px[i + k] * (1 - a) + c[k] * a; };
  const disc = (cx, cy, r, c, alpha = 1) => { for (let y = Math.floor(cy - r - 1); y <= cy + r + 1; y++) for (let x = Math.floor(cx - r - 1); x <= cx + r + 1; x++) { const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy); blend(x, y, c, alpha * Math.min(1, Math.max(0, r - d + 0.5))); } };
  disc(1080, 70, 260, [243, 224, 212]); disc(90, 600, 180, [226, 236, 229]);
  // corazón
  const hc = [168, 74, 38], S = 70, HX = 600, HY = 170;
  for (let y = HY - 80; y < HY + 90; y++) for (let x = HX - 90; x < HX + 90; x++) {
    let cov = 0;
    for (let sy = 0; sy < 3; sy++) for (let sx = 0; sx < 3; sx++) { const u = (x + (sx + .5) / 3 - HX) / S, v = -(y + (sy + .5) / 3 - HY) / S + 0.15; const q = u * u + v * v - 1; if (q * q * q - u * u * v * v * v <= 0) cov++; }
    blend(x, y, hc, cov / 9);
  }
  const G = {
    n: ['.....', '.....', '####.', '#...#', '#...#', '#...#', '#...#', '.....', '.....'],
    o: ['.....', '.....', '.###.', '#...#', '#...#', '#...#', '.###.', '.....', '.....'],
    m: ['.....', '.....', '##.#.', '#.#.#', '#.#.#', '#.#.#', '#.#.#', '.....', '.....'],
    b: ['#....', '#....', '####.', '#...#', '#...#', '#...#', '####.', '.....', '.....'],
    r: ['.....', '.....', '#.##.', '##..#', '#....', '#....', '#....', '.....', '.....'],
    e: ['.....', '.....', '.###.', '#...#', '#####', '#....', '.###.', '.....', '.....'],
    s: ['.....', '.....', '.####', '#....', '.###.', '....#', '####.', '.....', '.....'],
    '.': ['.....', '.....', '.....', '.....', '.....', '.....', '#....', '.....', '.....'],
    c: ['.....', '.....', '.####', '#....', '#....', '#....', '.####', '.....', '.....'],
    p: ['.....', '.....', '####.', '#...#', '#...#', '#...#', '####.', '#....', '#....'],
    y: ['.....', '.....', '#...#', '#...#', '#...#', '#...#', '.####', '....#', '####.'],
  };
  const text = (str, pitch, y0, color) => {
    const widths = [...str].map(ch => ch === '.' ? 2 : 6);
    const total = widths.reduce((a, b) => a + b, 0) - 1;
    let x0 = (W - total * pitch) / 2;
    for (const ch of str) { const g = G[ch]; g.forEach((row, ry) => [...row].forEach((c, rx) => { if (c === '#') disc(x0 + rx * pitch + pitch / 2, y0 + ry * pitch + pitch / 2, pitch * 0.42, color); })); x0 += (ch === '.' ? 2 : 6) * pitch; }
  };
  text('nombres.com.py', 14, 300, [42, 36, 32]);
  for (let i = 0; i < 23; i++) disc(600 - 11 * 22 + i * 22, 500, i % 2 ? 4 : 6, i % 2 ? [63, 107, 85] : [168, 74, 38]);
  const raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; for (let x = 0; x < W * 3; x++) raw[y * (W * 3 + 1) + 1 + x] = Math.round(px[y * W * 3 + x]); }
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = buf => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
  writeFileSync(path, png);
}
