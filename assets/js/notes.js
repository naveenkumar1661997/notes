/* Notes reader: builds topic tabs, sidebar, breadcrumb, pager, TOC, search,
   code blocks and Mermaid diagrams from the site data embedded by the layout. */
(function () {
  'use strict';

  var PAGE = window.NT_PAGE || {};
  var BASE = PAGE.base || '';
  var DATA = [];
  try { DATA = JSON.parse(document.getElementById('nt-data').textContent) || []; } catch (e) { DATA = []; }

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function homeUrl() { return BASE + '/notes.html'; }
  function topicUrl(t) { return BASE + '/notes/' + t.id + '/'; }
  function articleUrl(t, a) { return BASE + '/notes/' + t.id + '/' + a.slug + '.html'; }

  // flatten every topic's articles once, numbering them 1..N within the topic
  DATA.forEach(function (t) {
    var n = 0;
    t.flat = [];
    (t.sections || []).forEach(function (s) {
      (s.articles || []).forEach(function (a) {
        n += 1;
        a.n = n;
        a.section = s.name;
        t.flat.push(a);
      });
    });
  });

  var topicIdx = -1;
  DATA.forEach(function (t, i) { if (t.id === PAGE.topic) topicIdx = i; });
  var TOPIC = topicIdx >= 0 ? DATA[topicIdx] : null;
  var CURRENT = null;
  if (TOPIC && PAGE.kind !== 'topic') {
    TOPIC.flat.forEach(function (a) { if (a.slug === PAGE.slug) CURRENT = a; });
  }

  /* ── Topic tabs ── */
  function renderTabs() {
    var nav = $('#ntTabs');
    if (!nav) return;
    var html = '<a href="' + homeUrl() + '"' + (PAGE.kind === 'home' ? ' class="is-active"' : '') + '>All topics</a>';
    DATA.forEach(function (t) {
      html += '<a href="' + topicUrl(t) + '"' + (TOPIC && t.id === TOPIC.id ? ' class="is-active"' : '') + '>' +
        '<span aria-hidden="true">' + esc(t.icon || '') + '</span>' + esc(t.title) + '</a>';
    });
    nav.innerHTML = html;
    var act = $('.is-active', nav);
    if (act && act.scrollIntoView) nav.scrollLeft = act.offsetLeft - 40;
  }

  /* ── Sidebar ── */
  function renderSidebar() {
    var side = $('#ntSide');
    if (!side) return;
    if (!TOPIC) { side.remove(); var m = $('#ntMenu'); if (m) m.style.display = 'none'; return; }
    var html = '<div class="nt-side-head"><span aria-hidden="true">' + esc(TOPIC.icon || '') + '</span>' +
      '<a href="' + topicUrl(TOPIC) + '">' + esc(TOPIC.title) + ' Tutorial</a>' +
      '<span class="nt-side-count">' + TOPIC.flat.length + ' articles</span></div>';
    (TOPIC.sections || []).forEach(function (s, si) {
      html += '<div class="nt-sec" data-sec="' + si + '"><button class="nt-sec-btn" type="button" aria-expanded="true">' +
        '<span>' + esc(s.name) + '</span><svg class="chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg></button><ol>';
      (s.articles || []).forEach(function (a) {
        var active = CURRENT && CURRENT.slug === a.slug;
        html += '<li><a href="' + articleUrl(TOPIC, a) + '"' + (active ? ' class="is-active" aria-current="page"' : '') + '>' +
          '<span class="n">' + a.n + '.</span><span>' + esc(a.title) + '</span></a></li>';
      });
      html += '</ol></div>';
    });
    side.innerHTML = html;
    $$('.nt-sec-btn', side).forEach(function (b) {
      b.addEventListener('click', function () {
        var sec = b.parentNode;
        sec.classList.toggle('is-closed');
        b.setAttribute('aria-expanded', sec.classList.contains('is-closed') ? 'false' : 'true');
      });
    });
    var act = $('a.is-active', side);
    if (act) {
      var top = act.offsetTop - side.clientHeight / 3;
      if (top > 0) side.scrollTop = top;
    }
  }

  /* ── Mobile drawer ── */
  function initDrawer() {
    var btn = $('#ntMenu'), side = $('#ntSide'), scrim = $('#ntScrim');
    if (!btn || !side) return;
    function set(open) {
      side.classList.toggle('is-open', open);
      scrim.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () { set(!side.classList.contains('is-open')); });
    scrim.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }

  /* ── Breadcrumb + meta ── */
  function renderCrumb() {
    var c = $('#ntCrumb');
    if (!c) return;
    if (PAGE.kind === 'home' || !TOPIC) { c.remove(); return; }
    var html = '<a href="' + homeUrl() + '">Notes</a><span class="sep">›</span>';
    if (PAGE.kind === 'topic') {
      html += '<span class="cur">' + esc(TOPIC.title) + '</span>';
    } else {
      html += '<a href="' + topicUrl(TOPIC) + '">' + esc(TOPIC.title) + '</a><span class="sep">›</span>';
      if (CURRENT) html += '<span>' + esc(CURRENT.section) + '</span><span class="sep">›</span>';
      html += '<span class="cur">' + esc(CURRENT ? CURRENT.title : document.title) + '</span>';
    }
    c.innerHTML = html;
    var tn = $('#ntTopicName');
    if (tn) tn.textContent = TOPIC.title + (CURRENT ? ' · Article ' + CURRENT.n + ' of ' + TOPIC.flat.length : ' Tutorial');
  }

  /* ── Pager ── */
  function renderPager() {
    var p = $('#ntPager');
    if (!p) return;
    if (!TOPIC) { p.remove(); return; }
    var prev = null, next = null;
    var nextTopic = DATA[topicIdx + 1];
    if (PAGE.kind === 'topic') {
      prev = { href: homeUrl(), lbl: '← All topics', ttl: 'Notes home' };
      if (TOPIC.flat[0]) next = { href: articleUrl(TOPIC, TOPIC.flat[0]), lbl: 'Start reading →', ttl: TOPIC.flat[0].title };
    } else if (CURRENT) {
      var i = CURRENT.n - 1;
      prev = i > 0
        ? { href: articleUrl(TOPIC, TOPIC.flat[i - 1]), lbl: '← Previous', ttl: TOPIC.flat[i - 1].title }
        : { href: topicUrl(TOPIC), lbl: '← Previous', ttl: TOPIC.title + ' overview' };
      if (i < TOPIC.flat.length - 1) next = { href: articleUrl(TOPIC, TOPIC.flat[i + 1]), lbl: 'Next →', ttl: TOPIC.flat[i + 1].title };
      else if (nextTopic) next = { href: topicUrl(nextTopic), lbl: 'Next topic →', ttl: nextTopic.title };
    }
    var html = '';
    if (prev) html += '<a class="prev" href="' + prev.href + '"><span class="lbl">' + esc(prev.lbl) + '</span><span class="ttl">' + esc(prev.ttl) + '</span></a>';
    if (next) html += '<a class="next" href="' + next.href + '"><span class="lbl">' + esc(next.lbl) + '</span><span class="ttl">' + esc(next.ttl) + '</span></a>';
    p.innerHTML = html;
  }

  /* ── Topic home: article cards ── */
  function renderTopicIndex() {
    var box = $('#ntTopicIndex');
    if (!box || PAGE.kind !== 'topic' || !TOPIC) return;
    var html = '<div class="nt-index"><h2 id="all-articles">All ' + esc(TOPIC.title) + ' articles</h2>';
    (TOPIC.sections || []).forEach(function (s) {
      html += '<div class="nt-index-sec"><h3>' + esc(s.name) + '</h3><div class="nt-index-grid">';
      (s.articles || []).forEach(function (a) {
        html += '<a class="nt-index-card" href="' + articleUrl(TOPIC, a) + '"><span class="n">' + a.n + '</span>' +
          '<span class="t">' + esc(a.title) + '</span><span class="s">' + esc(a.summary || '') + '</span></a>';
      });
      html += '</div></div>';
    });
    box.innerHTML = html + '</div>';
  }

  /* ── Notes home: every topic with its articles ── */
  function renderHome() {
    var box = $('#ntTopicIndex');
    if (!box || PAGE.kind !== 'home') return;
    var total = 0;
    DATA.forEach(function (t) { total += t.flat.length; });
    var stats = $('#ntHomeStats');
    if (stats) stats.innerHTML = '<span><b>' + DATA.length + '</b> topics</span><span><b>' + total + '</b> articles</span>';
    var html = '<div class="nt-home-grid">';
    DATA.forEach(function (t) {
      html += '<section class="nt-home-topic" id="' + esc(t.id) + '"><h2><span class="ic" aria-hidden="true">' + esc(t.icon || '') + '</span>' +
        '<a href="' + topicUrl(t) + '">' + esc(t.title) + '</a></h2><p class="tg">' + esc(t.tagline || '') + '</p>';
      (t.sections || []).forEach(function (s) {
        html += '<div class="sec">' + esc(s.name) + '</div><ol start="' + (s.articles[0] ? s.articles[0].n : 1) + '">';
        (s.articles || []).forEach(function (a) {
          html += '<li><a href="' + articleUrl(t, a) + '">' + esc(a.title) + '</a></li>';
        });
        html += '</ol>';
      });
      html += '<a class="more" href="' + topicUrl(t) + '">Open ' + esc(t.title) + ' tutorial →</a></section>';
    });
    box.innerHTML = html + '</div>';
    if (location.hash) {
      var el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) {
        el.classList.add('is-target');
        setTimeout(function () { el.scrollIntoView(); }, 30);
      }
    }
  }

  /* ── Headings: ids + anchors ── */
  function slugify(s) {
    return s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80) || 'section';
  }
  function prepHeadings() {
    var art = $('#ntArticle');
    if (!art) return [];
    var seen = {};
    var hs = $$('h2, h3', art).filter(function (h) { return !h.closest('.nt-home-topic') && !h.classList.contains('nt-title'); });
    hs.forEach(function (h) {
      if (!h.id) {
        var id = slugify(h.textContent), k = id, i = 2;
        while (seen[k] || document.getElementById(k)) { k = id + '-' + (i++); }
        h.id = k;
      }
      seen[h.id] = true;
      if (!h.querySelector('.anchor') && !h.closest('.nt-index')) {
        var a = document.createElement('a');
        a.className = 'anchor'; a.href = '#' + h.id; a.textContent = '#'; a.setAttribute('aria-label', 'Link to this section');
        h.appendChild(a);
      }
    });
    return hs;
  }

  /* ── On-this-page TOC with scroll-spy ── */
  function renderToc(hs) {
    var toc = $('#ntToc');
    if (!toc) return;
    var items = hs.filter(function (h) { return !h.closest('.nt-index-sec'); });
    if (PAGE.kind === 'home' || items.length < 2) { toc.innerHTML = ''; return; }
    var html = '<div class="nt-toc-h">On this page</div><ul>';
    items.forEach(function (h) {
      var label = h.cloneNode(true);
      $$('.anchor', label).forEach(function (x) { x.remove(); });
      html += '<li class="' + (h.tagName === 'H3' ? 'l3' : 'l2') + '"><a href="#' + h.id + '">' + esc(label.textContent.trim()) + '</a></li>';
    });
    toc.innerHTML = html + '</ul>';
    var links = $$('a', toc);
    var ticking = false;
    function spy() {
      ticking = false;
      var y = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-h'), 10) || 56) + 70;
      var active = 0;
      items.forEach(function (h, i) { if (h.getBoundingClientRect().top - y <= 0) active = i; });
      links.forEach(function (l, i) { l.classList.toggle('is-active', i === active); });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  /* ── Code blocks: normalise kramdown/rouge + plain <pre>, highlight, copy ── */
  var LANG_LABEL = {
    sql: 'SQL', pgsql: 'PostgreSQL', postgresql: 'PostgreSQL', mysql: 'MySQL', java: 'Java', python: 'Python', py: 'Python',
    bash: 'Shell', sh: 'Shell', shell: 'Shell', console: 'Terminal', zsh: 'Shell', powershell: 'PowerShell',
    yaml: 'YAML', yml: 'YAML', json: 'JSON', xml: 'XML', dockerfile: 'Dockerfile', docker: 'Dockerfile',
    groovy: 'Groovy', jenkinsfile: 'Jenkinsfile', text: 'Text', plaintext: 'Text', output: 'Output',
    ini: 'INI', toml: 'TOML', properties: 'Properties', javascript: 'JavaScript', js: 'JavaScript',
    typescript: 'TypeScript', diff: 'Diff', scala: 'Scala', http: 'HTTP', hcl: 'HCL', git: 'Git', csv: 'CSV', jinja: 'Jinja'
  };
  var HL_ALIAS = { sh: 'bash', shell: 'bash', console: 'bash', zsh: 'bash', git: 'bash', yml: 'yaml', py: 'python',
    docker: 'dockerfile', jenkinsfile: 'groovy', postgresql: 'pgsql', mysql: 'sql', js: 'javascript', jinja: 'plaintext', csv: 'plaintext' };

  function langOf(el) {
    var m = (el.className || '').match(/language-([\w+-]+)/);
    return m ? m[1].toLowerCase() : '';
  }

  var diagrams = [];

  function prepCode() {
    var art = $('#ntArticle');
    if (!art) return;
    $$('pre', art).forEach(function (pre) {
      if (pre.closest('.nt-code') || pre.closest('.nt-diagram')) return;
      var wrap = pre.closest('div.highlighter-rouge') || pre;
      var code = pre.querySelector('code') || pre;
      var lang = langOf(wrap) || langOf(code) || langOf(pre) || (pre.getAttribute('data-lang') || '').toLowerCase();
      var text = code.textContent.replace(/\n$/, '');

      if (lang === 'mermaid') {
        var fig = document.createElement('div');
        fig.className = 'nt-diagram';
        var m = document.createElement('div');
        m.className = 'mermaid';
        fig.appendChild(m);
        wrap.parentNode.replaceChild(fig, wrap);
        diagrams.push({ fig: fig, el: m, src: text });
        return;
      }

      var box = document.createElement('div');
      box.className = 'nt-code' + (lang === 'output' ? ' is-output' : '');
      var head = document.createElement('div');
      head.className = 'nt-code-head';
      head.innerHTML = '<span>' + esc(LANG_LABEL[lang] || (lang ? lang : 'Code')) + '</span>';
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'nt-copy'; btn.textContent = 'Copy';
      btn.addEventListener('click', function () { copy(text, btn); });
      head.appendChild(btn);
      var npre = document.createElement('pre');
      var ncode = document.createElement('code');
      ncode.textContent = text;
      var hl = HL_ALIAS[lang] || lang;
      if (window.hljs && hl && hl !== 'output' && hl !== 'text' && hl !== 'plaintext' && hljs.getLanguage(hl)) {
        try { ncode.innerHTML = hljs.highlight(text, { language: hl, ignoreIllegals: true }).value; } catch (e) {}
      }
      npre.appendChild(ncode);
      box.appendChild(head);
      box.appendChild(npre);
      wrap.parentNode.replaceChild(box, wrap);
    });
  }

  function copy(text, btn) {
    function done() { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1400); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      ta.remove();
    }
  }

  /* ── <details>: kramdown may wrap <summary> in a <p>; lift it back out ── */
  function prepDetails() {
    $$('#ntArticle details').forEach(function (d) {
      var s = d.querySelector('summary');
      if (s && s.parentNode !== d) {
        var p = s.parentNode;
        d.insertBefore(s, d.firstChild);
        if (p.tagName === 'P' && !p.textContent.trim()) p.remove();
      }
    });
  }

  /* ── Tables: scroll wrapper ── */
  function prepTables() {
    $$('#ntArticle table').forEach(function (t) {
      if (t.parentNode.classList && t.parentNode.classList.contains('nt-table')) return;
      var w = document.createElement('div');
      w.className = 'nt-table';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  /* ── Mermaid (theme-aware, re-rendered on theme change) ── */
  function mermaidConfig() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'strict',
      fontFamily: 'Inter, system-ui, sans-serif',
      flowchart: { curve: 'basis', useMaxWidth: true, htmlLabels: true },
      sequence: { useMaxWidth: true, mirrorActors: false, actorFontSize: 15, messageFontSize: 15, noteFontSize: 14 },
      themeVariables: dark ? {
        darkMode: true, background: '#151b23', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px',
        primaryColor: '#1d2a34', primaryTextColor: '#e6edf3', primaryBorderColor: '#3ccf98',
        secondaryColor: '#232c38', secondaryTextColor: '#e6edf3', secondaryBorderColor: '#4b5a6b',
        tertiaryColor: '#1a2129', tertiaryTextColor: '#e6edf3', tertiaryBorderColor: '#3a4656',
        lineColor: '#8b98a8', textColor: '#e6edf3', mainBkg: '#1d2a34', nodeBorder: '#3ccf98',
        clusterBkg: '#141a21', clusterBorder: '#2e3947', edgeLabelBackground: '#151b23', titleColor: '#e6edf3',
        actorBkg: '#1d2a34', actorBorder: '#3ccf98', actorTextColor: '#e6edf3', signalColor: '#b9c4d0', signalTextColor: '#e6edf3',
        labelBoxBkgColor: '#1d2a34', labelBoxBorderColor: '#3ccf98', labelTextColor: '#e6edf3', loopTextColor: '#e6edf3',
        noteBkgColor: '#2a2616', noteBorderColor: '#8a7a3a', noteTextColor: '#f2e9c9',
        activationBkgColor: '#232c38', activationBorderColor: '#3ccf98'
      } : {
        darkMode: false, background: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px',
        primaryColor: '#e9f6f0', primaryTextColor: '#1c2430', primaryBorderColor: '#0f7b5f',
        secondaryColor: '#eef3fb', secondaryTextColor: '#1c2430', secondaryBorderColor: '#7a9cc6',
        tertiaryColor: '#f7f8fa', tertiaryTextColor: '#1c2430', tertiaryBorderColor: '#c9d2dc',
        lineColor: '#5b6b7b', textColor: '#1c2430', mainBkg: '#e9f6f0', nodeBorder: '#0f7b5f',
        clusterBkg: '#f7f9fb', clusterBorder: '#d3dae3', edgeLabelBackground: '#ffffff', titleColor: '#1c2430',
        actorBkg: '#e9f6f0', actorBorder: '#0f7b5f', actorTextColor: '#1c2430', signalColor: '#46525f', signalTextColor: '#1c2430',
        labelBoxBkgColor: '#e9f6f0', labelBoxBorderColor: '#0f7b5f', labelTextColor: '#1c2430', loopTextColor: '#1c2430',
        noteBkgColor: '#fff8db', noteBorderColor: '#e0c96a', noteTextColor: '#3d3415',
        activationBkgColor: '#eef3fb', activationBorderColor: '#0f7b5f'
      }
    };
  }

  var renderSeq = 0;
  function renderDiagrams() {
    if (!window.mermaid || !diagrams.length) return Promise.resolve();
    mermaid.initialize(mermaidConfig());
    var run = ++renderSeq;
    return diagrams.reduce(function (p, d, i) {
      return p.then(function () {
        if (run !== renderSeq) return;
        return mermaid.render('ntd-' + run + '-' + i, d.src).then(function (res) {
          d.fig.classList.remove('is-error');
          d.el.innerHTML = res.svg;
          if (res.bindFunctions) res.bindFunctions(d.el);
        }).catch(function (err) {
          d.fig.classList.add('is-error');
          d.el.innerHTML = '<pre>' + esc(d.src) + '</pre>';
          if (window.console) console.warn('Diagram ' + i + ' failed to render', err);
          var orphan = document.getElementById('dntd-' + run + '-' + i);
          if (orphan) orphan.remove();
        });
      });
    }, Promise.resolve());
  }

  /* ── Theme toggle ── */
  function initTheme() {
    var b = $('#ntTheme');
    if (!b) return;
    b.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('nt-theme', next); } catch (e) {}
      renderDiagrams();
    });
  }

  /* ── Search over every article title + summary ── */
  function initSearch() {
    var input = $('#ntSearch'), box = $('#ntSearchResults');
    if (!input || !box) return;
    var index = [];
    DATA.forEach(function (t) {
      index.push({ topic: t.title, title: t.title + ' tutorial', sum: t.tagline || '', url: topicUrl(t) });
      t.flat.forEach(function (a) {
        index.push({ topic: t.title, title: a.title, sum: a.summary || '', url: articleUrl(t, a) });
      });
    });
    var sel = -1, results = [];
    function show(q) {
      q = q.trim().toLowerCase();
      if (!q) { box.hidden = true; return; }
      var terms = q.split(/\s+/);
      results = index.map(function (it) {
        var title = it.title.toLowerCase(), hay = (it.topic + ' ' + it.title + ' ' + it.sum).toLowerCase();
        for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) < 0) return null;
        var score = 0;
        terms.forEach(function (w) { if (title.indexOf(w) >= 0) score += 3; if (title.indexOf(w) === 0) score += 2; });
        return { it: it, score: score };
      }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).slice(0, 12);
      sel = results.length ? 0 : -1;
      box.innerHTML = results.length ? results.map(function (r, i) {
        return '<a href="' + r.it.url + '"' + (i === sel ? ' class="is-active"' : '') + ' role="option">' +
          '<div class="sr-topic">' + esc(r.it.topic) + '</div><div class="sr-title">' + esc(r.it.title) + '</div>' +
          (r.it.sum ? '<div class="sr-sum">' + esc(r.it.sum) + '</div>' : '') + '</a>';
      }).join('') : '<div class="sr-empty">No articles match “' + esc(q) + '”.</div>';
      box.hidden = false;
    }
    function move(d) {
      var links = $$('a', box);
      if (!links.length) return;
      sel = (sel + d + links.length) % links.length;
      links.forEach(function (l, i) { l.classList.toggle('is-active', i === sel); });
      links[sel].scrollIntoView({ block: 'nearest' });
    }
    input.addEventListener('input', function () { show(input.value); });
    input.addEventListener('focus', function () { if (input.value) show(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { var l = $$('a', box)[sel]; if (l) { e.preventDefault(); location.href = l.href; } }
      else if (e.key === 'Escape') { box.hidden = true; input.blur(); }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.nt-search')) box.hidden = true; });
    document.addEventListener('keydown', function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); input.focus(); }
    });
  }

  /* ── Back to top ── */
  function initToTop() {
    var b = $('#ntToTop');
    if (!b) return;
    window.addEventListener('scroll', function () { b.hidden = window.scrollY < 700; }, { passive: true });
    b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  function init() {
    renderTabs();
    renderSidebar();
    initDrawer();
    renderCrumb();
    renderPager();
    renderTopicIndex();
    renderHome();
    prepCode();
    prepDetails();
    prepTables();
    renderToc(prepHeadings());
    initTheme();
    initSearch();
    initToTop();
    // Mermaid sizes labels by measuring text: wait for the web font or labels get clipped
    var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 2500); })]).then(renderDiagrams);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
