/* nombres.com.py: favoritos, buscador, Mi lista, apellidos y duelo. Sin dependencias. */
(function () {
  'use strict';
  var FAV_KEY = 'nombres:favs', AP_KEY = 'nombres:apellidos';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- almacenamiento seguro ----------
  function load(key, fallback) {
    try { var v = window.localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin almacenamiento */ }
  }
  var favs = load(FAV_KEY, []);
  if (!Array.isArray(favs)) favs = [];
  favs = favs.filter(function (f) { return f && typeof f.s === 'string' && /^[a-z0-9-]{1,60}$/.test(f.s); });
  function isFav(slug) { return favs.some(function (f) { return f.s === slug; }); }
  function toggleFav(slug, name) {
    if (isFav(slug)) favs = favs.filter(function (f) { return f.s !== slug; });
    else favs.push({ s: slug, n: name });
    save(FAV_KEY, favs);
    refresh();
  }

  // ---------- utilidades ----------
  function fold(s) { return String(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var GL = { f: 'niña', m: 'varón', u: 'unisex' };
  function favBtn(slug, name) {
    return '<button type="button" class="fav" data-slug="' + slug + '" data-name="' + esc(name) + '" aria-pressed="' + isFav(slug) + '" aria-label="Guardar ' + esc(name) + ' en mi lista"><svg aria-hidden="true" focusable="false"><use href="#h"/></svg></button>';
  }
  function cardHtml(n) {
    return '<li class="card g-' + n.g + '"><a class="card-link" href="/nombre/' + n.s + '/"><span class="card-name">' + esc(n.n) +
      '</span><span class="card-mean">' + esc(n.m) + '</span><span class="card-meta">' + esc(n.o) + ' · ' + GL[n.g] + '</span></a>' + favBtn(n.s, n.n) + '</li>';
  }
  function listUrl(slugs, winner) {
    return location.origin + '/mi-lista/?n=' + slugs.join(',') + (winner ? '&g=' + winner : '');
  }
  function waUrl(text) { return 'https://wa.me/?text=' + encodeURIComponent(text); }

  // ---------- datos (carga perezosa) ----------
  var dataPromise = null;
  function getData() {
    if (!dataPromise) {
      dataPromise = fetch(document.body.getAttribute('data-names')).then(function (r) { return r.json(); }).then(function (d) {
        var list = d.n.map(function (r) {
          return { s: r[0], n: r[1], g: r[2], o: r[3], m: r[4], t: r[5].split('').map(function (i) { return d.tags[+i]; }), k: fold(r[1]) };
        });
        var by = {}; list.forEach(function (n) { by[n.s] = n; });
        return { list: list, by: by };
      });
    }
    return dataPromise;
  }

  // ---------- corazones en toda la página ----------
  function syncHearts() {
    $$('.fav').forEach(function (b) { b.hidden = false; b.setAttribute('aria-pressed', String(isFav(b.getAttribute('data-slug')))); });
    $$('[data-fav-count]').forEach(function (el) { el.textContent = favs.length; });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.fav');
    if (!b) return;
    e.preventDefault();
    toggleFav(b.getAttribute('data-slug'), b.getAttribute('data-name'));
  });

  var renderers = [];
  function refresh() { syncHearts(); renderers.forEach(function (fn) { fn(); }); }

  // ---------- mini lista (inicio y buscador) ----------
  $$('[data-mini]').forEach(function (box) {
    box.hidden = false;
    renderers.push(function () {
      $('[data-mini-empty]', box).hidden = favs.length > 0;
      $('[data-mini-list]', box).innerHTML = favs.map(function (f) { return '<li><a href="/nombre/' + f.s + '/">' + esc(f.n) + '</a></li>'; }).join('');
    });
  });

  // ---------- buscador ----------
  var form = $('[data-tool]');
  if (form) {
    form.hidden = false;
    var results = $('[data-tool-results]'), countEl = $('[data-tool-count]');
    var PAGE = 48, shown = PAGE, touched = false;
    var params = new URLSearchParams(location.search);
    ['q', 'g', 'o', 't', 'l', 'n'].forEach(function (k) { if (params.get(k) && form.elements[k]) { form.elements[k].value = params.get(k); touched = true; } });
    var seq = 0;
    var run = function () {
      var mySeq = ++seq;
      getData().then(function (data) {
        if (mySeq !== seq) return;
        var q = fold(form.elements.q.value.trim()), g = form.elements.g.value, o = form.elements.o.value,
          t = form.elements.t.value, l = form.elements.l.value, max = +form.elements.n.value || 0;
        var list = data.list.filter(function (n) {
          if (g && n.g !== g) return false;
          if (o && n.o.split(' y ').indexOf(o) < 0) return false;
          if (t && n.t.indexOf(t) < 0) return false;
          if (l && n.s.charAt(0) !== l) return false;
          if (max && n.n.replace(/[^\p{L}]/gu, '').length > max) return false;
          if (q && n.k.indexOf(q) < 0) return false;
          return true;
        });
        if (q) list.sort(function (a, b) { return (a.k.indexOf(q) === 0 ? 0 : 1) - (b.k.indexOf(q) === 0 ? 0 : 1); });
        countEl.textContent = list.length === 1 ? '1 nombre' : list.length + ' nombres';
        var html = list.length ? '<ul class="cards">' + list.slice(0, shown).map(cardHtml).join('') + '</ul>' :
          '<p>No encontramos nombres con esos filtros. Probá con menos filtros o con otra búsqueda.</p>';
        if (list.length > shown) html += '<button type="button" class="btn btn-ghost more-btn" data-more>Mostrar más (' + (list.length - shown) + ')</button>';
        results.innerHTML = html;
      });
    };
    var onChange = function () { shown = PAGE; touched = true; run(); };
    form.addEventListener('input', onChange);
    form.addEventListener('submit', function (e) { e.preventDefault(); onChange(); });
    form.addEventListener('reset', function () { setTimeout(onChange, 0); });
    results.addEventListener('click', function (e) {
      if (e.target.closest('[data-more]')) { shown += PAGE; run(); }
    });
    // En /elegir/ la lista completa se reemplaza por tarjetas; en el inicio sólo al filtrar.
    if (touched || document.body.hasAttribute('data-tool-auto')) run();
    renderers.push(function () { if (touched || document.body.hasAttribute('data-tool-auto')) syncHearts(); });
  }

  // ---------- Mi lista ----------
  var mine = $('[data-mine]');
  if (mine) {
    var params2 = new URLSearchParams(location.search);
    var sharedParam = params2.get('n');
    var shared = $('[data-shared]');
    if (sharedParam) {
      getData().then(function (data) {
        var slugs = sharedParam.split(',').filter(function (s, i, a) { return data.by[s] && a.indexOf(s) === i; }).slice(0, 60);
        shared.hidden = false;
        var w = params2.get('g');
        if (w && data.by[w]) { var wEl = $('[data-shared-winner]'); wEl.hidden = false; wEl.textContent = 'Ganador del duelo: ' + data.by[w].n; }
        var draw = function () {
          $('[data-shared-list]').innerHTML = slugs.length ? slugs.map(function (s) { return cardHtml(data.by[s]); }).join('') : '<li>El enlace no tiene nombres válidos.</li>';
        };
        draw(); renderers.push(draw);
        $('[data-save-all]').addEventListener('click', function () {
          slugs.forEach(function (s) { if (!isFav(s)) favs.push({ s: s, n: data.by[s].n }); });
          save(FAV_KEY, favs); refresh();
        });
        $('[data-ml-title]').textContent = 'Lista de nombres compartida';
      });
    }
    mine.hidden = false;
    var ap = $('[data-apellido]'), duel = $('[data-duel]');
    ap.hidden = false; duel.hidden = false;
    var aps = load(AP_KEY, { a: '', b: '' });
    if (!aps || typeof aps !== 'object') aps = { a: '', b: '' };
    var ap1 = $('[data-ap1]'), ap2 = $('[data-ap2]');
    ap1.value = aps.a || ''; ap2.value = aps.b || '';
    var drawFullnames = function () {
      var sur = [ap1.value.trim(), ap2.value.trim()].filter(Boolean).join(' ');
      $('[data-fullnames]').innerHTML = favs.length ? favs.map(function (f) { return '<li>' + esc(f.n + (sur ? ' ' + sur : ' …')) + '</li>'; }).join('') :
        '<li>Guardá algunos nombres para verlos con tu apellido.</li>';
    };
    [ap1, ap2].forEach(function (inp) {
      inp.addEventListener('input', function () { save(AP_KEY, { a: ap1.value.slice(0, 40), b: ap2.value.slice(0, 40) }); drawFullnames(); });
    });
    var drawMine = function () {
      $('[data-empty]').hidden = favs.length > 0;
      var ul = $('[data-my-list]');
      getData().then(function (data) {
        ul.innerHTML = favs.map(function (f) {
          return data.by[f.s] ? cardHtml(data.by[f.s]) : '<li class="card"><span class="card-link"><span class="card-name">' + esc(f.n) + '</span></span>' + favBtn(f.s, f.n) + '</li>';
        }).join('');
        syncHearts();
      });
      var box = $('[data-share-box]');
      box.hidden = favs.length === 0;
      if (favs.length) {
        var u = listUrl(favs.map(function (f) { return f.s; }));
        $('[data-share-url]').value = u;
        $('[data-wa]').href = waUrl('Mi lista de nombres para el bebé: ' + u);
      }
      $('[data-duel-help]').textContent = favs.length < 2 ? 'Guardá al menos dos nombres para hacer el duelo.' :
        'Elegí entre dos favoritos por vez. El ganador sigue en juego contra el próximo, hasta que queda uno solo.';
      $$('[data-duel-start]').forEach(function (b) { b.disabled = favs.length < 2; });
      drawFullnames();
    };
    renderers.push(drawMine);
    $('[data-copy]').addEventListener('click', function (e) {
      var inp = $('[data-share-url]'), btn = e.currentTarget;
      var done = function () { btn.textContent = '¡Copiado!'; setTimeout(function () { btn.textContent = 'Copiar enlace'; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(inp.value).then(done, function () { inp.select(); });
      else { inp.select(); try { document.execCommand('copy'); done(); } catch (err) { /* el usuario puede copiar a mano */ } }
    });

    // Duelo: el ganador queda y enfrenta al siguiente.
    var queue = [], champ = null, round = 0, total = 0;
    var stage = $('[data-duel-stage]'), result = $('[data-duel-result]'), btnA = $('[data-duel-a]'), btnB = $('[data-duel-b]');
    var showPair = function () {
      if (!queue.length) {
        stage.hidden = true; result.hidden = false;
        $('[data-duel-winner]').textContent = 'Ganó ' + champ.n + '.';
        $('[data-duel-wa]').href = waUrl('En nuestro duelo de nombres ganó ' + champ.n + '. Mirá la lista: ' + listUrl(favs.map(function (f) { return f.s; }), champ.s));
        result.scrollIntoView({ block: 'nearest' });
        return;
      }
      round++;
      $('[data-duel-round]').textContent = 'Duelo ' + round + ' de ' + total;
      btnA.textContent = champ.n; btnB.textContent = queue[0].n;
    };
    $$('[data-duel-start]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (favs.length < 2) return;
        queue = favs.slice(); champ = queue.shift(); round = 0; total = queue.length;
        result.hidden = true; stage.hidden = false; showPair(); btnA.focus();
      });
    });
    btnA.addEventListener('click', function () { queue.shift(); showPair(); });
    btnB.addEventListener('click', function () { champ = queue.shift(); showPair(); });
  }

  refresh();
})();
