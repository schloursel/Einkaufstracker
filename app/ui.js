// UI-Gerüst: Router (Hash), untere Leiste, Kopfzeile, Bottom Sheet, Ereignis-Verteilung.
(function () {
  const ET = window.ET, S = ET.S, esc = ET.esc;
  ET.acts = {};      // data-act -> Funktion(el, event)
  ET.views = {};     // Route -> () => { title, html, after? }
  const inputHandlers = [], changeHandlers = [];
  ET.onInput = fn => inputHandlers.push(fn);
  ET.onChange = fn => changeHandlers.push(fn);

  // ---------- Theme ----------
  ET.applyTheme = () => {
    const t = S.settings.theme, el = document.documentElement;
    if (t === 'light' || t === 'dark') el.setAttribute('data-theme', t); else el.removeAttribute('data-theme');
  };

  // ---------- Router ----------
  const TABS = [
    ['home', 'Home', '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>'],
    ['plan', 'Plan', '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'],
    ['shop', 'Einkauf', '<path d="M3 4h2l2.4 11h10.2L20 8H6.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>'],
    ['pantry', 'Vorrat', '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M5 10h14M9 6v2M9 13v3"/>'],
    ['more', 'Mehr', '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>']
  ];
  const route = () => (location.hash || '#home').slice(1) || 'home';
  ET.go = r => { if (route() === r) ET.render(); else location.hash = '#' + r; };
  ET.route = route;

  function renderTabbar() {
    const tab = route().split('/')[0];
    document.getElementById('tabbar').innerHTML = TABS.map(([k, l, svg]) =>
      `<button data-act="go" data-r="${k}" class="${k === tab ? 'on' : ''}" aria-label="${l}"><svg viewBox="0 0 24 24" aria-hidden="true">${svg}</svg>${l}</button>`).join('');
  }
  ET.render = function () {
    const r = route(), v = ET.views[r] || ET.views[r.split('/')[0]] || ET.views.home;
    const out = v(r);
    const sub = r.includes('/');
    document.getElementById('head').innerHTML = (sub ? `<h1><button class="back" data-act="go" data-r="${r.split('/')[0]}" aria-label="Zurück">‹ Zurück</button></h1><span class="muted" style="font-weight:600;color:var(--text);font-size:1.1rem">${esc(out.title)}</span><span></span>`
      : `<h1>${esc(out.title)}</h1><span class="muted">${esc(out.sub || '')}</span>`);
    const view = document.getElementById('view');
    const keep = view.scrollTop;
    view.innerHTML = out.html;
    renderTabbar();
    if (out.after) out.after();
    document.title = !out.title || out.title === 'Einkaufstracker' ? 'Einkaufstracker' : out.title + ' · Einkaufstracker';
  };
  window.addEventListener('hashchange', () => { window.scrollTo(0, 0); ET.render(); });

  // ---------- Sheet ----------
  let sheetFn = null, sheetOnClose = null;
  const el = id => document.getElementById(id);
  ET.sheet = {
    open(title, fn, onClose) {
      sheetFn = fn; sheetOnClose = onClose || null;
      el('sheet-title').textContent = title;
      el('sheet-body').innerHTML = fn();
      el('sheet').classList.add('open'); el('sheet-backdrop').classList.add('open');
      document.body.classList.add('noscroll');
      el('sheet-body').scrollTop = 0;
    },
    refresh() { if (sheetFn) { const b = el('sheet-body'), t = b.scrollTop; b.innerHTML = sheetFn(); b.scrollTop = t; } },
    close() {
      if (!sheetFn) return;
      el('sheet').classList.remove('open'); el('sheet-backdrop').classList.remove('open');
      document.body.classList.remove('noscroll');
      const cb = sheetOnClose; sheetFn = null; sheetOnClose = null;
      setTimeout(() => { if (!sheetFn) el('sheet-body').innerHTML = ''; }, 260);
      if (cb) cb();
    },
    isOpen: () => !!sheetFn
  };
  el('sheet-backdrop').addEventListener('click', () => ET.sheet.close());
  el('sheet-close').addEventListener('click', () => ET.sheet.close());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') ET.sheet.close(); });

  // ---------- Ereignisse ----------
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-act]'); if (!t) return;
    const fn = ET.acts[t.dataset.act];
    if (fn) fn(t, e);
  });
  document.addEventListener('input', e => inputHandlers.forEach(fn => fn(e)));
  document.addEventListener('change', e => changeHandlers.forEach(fn => fn(e)));
  ET.acts.go = t => { ET.sheet.close(); ET.go(t.dataset.r); };
  ET.acts.closeSheet = () => ET.sheet.close();

  // ---------- kleine UI-Bausteine ----------
  ET.ui = {
    chip: (label, on, act, extra = '') => `<button class="chip ${on ? 'on' : ''}" data-act="${act}" ${extra}>${label}</button>`,
    bar: (v, max) => { const p = max > 0 ? Math.min(100, v / max * 100) : 0; return `<div class="bar ${max > 0 && v > max ? 'over' : ''}"><i style="width:${p}%"></i></div>`; },
    check: on => `<span class="check ${on ? 'on' : ''}">✓</span>`
  };
})();
