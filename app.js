(function () {
  const KEY = 'et_state_v1';
  // Nur Mo-Fr früh: Abendessen Mo-Do (je 2 Portionen, Rest am Folgetag). Ab Freitag früh bei den Eltern.
  const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag'];
  const PROTEIN_GOAL = 100; // g/Tag, Richtwert (inkl. Shake), anpassbar im State
  const cat = id => CATALOG.find(c => c.id === id);
  const rec = id => RECIPES.find(r => r.id === id);
  const eur = n => n.toFixed(2).replace('.', ',') + ' €';
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  function nextMonday(from = new Date()) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const diff = (8 - d.getDay()) % 7; // 0 wenn heute Montag
    return addDays(d, diff);
  }

  let S = load();
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s) return s; } catch (e) {}
    return { prices: {}, pantry: {}, plan: null, history: [], waste: [], seed: 1 };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  // ---------- Preise ----------
  // Wochenangebote aus offers.js (vom Sonntags-Lauf geschrieben); gelten nur für die passende Woche
  const OFF = window.OFFERS || { week: '', items: [] };
  const targetWeek = () => (S.plan ? S.plan.week : iso(nextMonday()));
  const offersValid = () => OFF.week === targetWeek();
  function autoOffer(id) {
    if (!offersValid()) return 0;
    const m = OFF.items.find(x => x.catalogId === id && x.packPrice > 0);
    return m ? m.packPrice : 0;
  }
  function price(id) {
    const o = S.prices[id] || {};
    return o.offer || autoOffer(id) || o.price || cat(id).price;
  }
  const isOffer = id => !!((S.prices[id] && S.prices[id].offer) || autoOffer(id));

  // ---------- Bedarf / Einkaufsliste ----------
  function need(recipeIds) {
    const n = {};
    recipeIds.forEach(rid => { for (const [id, a] of Object.entries(rec(rid).ing)) n[id] = (n[id] || 0) + a; });
    return n;
  }
  function pantryAmt(id) { return (S.pantry[id] && S.pantry[id].amount) || 0; }
  function shoppingFor(recipeIds) {
    const n = need(recipeIds), list = [];
    for (const [id, a] of Object.entries(n)) {
      const c = cat(id), missing = a - pantryAmt(id);
      if (missing <= 0) continue;
      const packs = Math.ceil(missing / c.pack - 1e-9);
      list.push({ id, packs, amount: packs * c.pack, cost: packs * price(id) });
    }
    return list;
  }
  const listCost = l => l.reduce((s, x) => s + x.cost, 0);

  // ---------- Planer ----------
  function portionProtein(r) {
    return Object.entries(r.ing).reduce((s, [id, a]) => s + a * cat(id).p, 0) / 2;
  }
  function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  function generatePlan() {
    S.seed = (S.seed || 1) * 7 + 3;
    const rand = rng(S.seed % 2147483646 + 1);
    const chosen = [], groups = {};
    const pool = RECIPES.slice();
    while (chosen.length < DAYS.length && pool.length) {
      const base = listCost(shoppingFor(chosen));
      let best = null, bestScore = Infinity;
      for (const r of pool) {
        if ((groups[r.group] || 0) >= 1) continue;
        const marginal = listCost(shoppingFor([...chosen, r.id])) - base;
        const prot = portionProtein(r);
        const score = marginal - Math.min(prot, 40) * 0.08 + rand() * 1.2;
        if (score < bestScore) { bestScore = score; best = r; }
      }
      if (!best) break;
      chosen.push(best.id); groups[best.group] = (groups[best.group] || 0) + 1;
      pool.splice(pool.indexOf(best), 1);
    }
    S.plan = { week: iso(nextMonday()), recipes: chosen, cooked: chosen.map(() => false), bought: false };
    save();
  }

  // ---------- Aktionen ----------
  function markBought() {
    const list = shoppingFor(S.plan.recipes);
    const today = new Date();
    list.forEach(x => {
      const c = cat(x.id), p = S.pantry[x.id] || { amount: 0 };
      p.amount += x.amount; p.exp = iso(addDays(today, c.shelf));
      S.pantry[x.id] = p;
    });
    S.history.push({ date: iso(today), total: listCost(list), items: list.length });
    S.plan.bought = true; save(); render();
  }
  function toggleCooked(i) {
    const r = rec(S.plan.recipes[i]);
    if (!S.plan.cooked[i]) {
      for (const [id, a] of Object.entries(r.ing)) {
        if (S.pantry[id]) S.pantry[id].amount = Math.max(0, S.pantry[id].amount - a);
      }
    } else {
      for (const [id, a] of Object.entries(r.ing)) {
        const p = S.pantry[id] || { amount: 0, exp: iso(addDays(new Date(), cat(id).shelf)) };
        p.amount += a; S.pantry[id] = p;
      }
    }
    S.plan.cooked[i] = !S.plan.cooked[i]; save(); render();
  }
  function adjustPantry(id, delta) {
    const p = S.pantry[id]; if (!p) return;
    p.amount = Math.max(0, p.amount + delta); save(); render();
  }
  function discard(id) {
    const p = S.pantry[id]; if (!p || !p.amount) return;
    const c = cat(id);
    S.waste.push({ date: iso(new Date()), id, value: p.amount / c.pack * price(id) });
    p.amount = 0; save(); render();
  }

  // ---------- Views ----------
  let tab = 'plan';
  const TABS = [['plan', 'Wochenplan'], ['list', 'Einkauf'], ['offers', 'Angebote'], ['pantry', 'Vorrat'], ['prices', 'Preise'], ['tracker', 'Tracker']];

  function offersView() {
    const ok = offersValid();
    const head = !OFF.items.length ? '<div class="card warn">Noch keine Angebote geladen.</div>'
      : `<div class="card ${ok ? '' : 'warn'}"><b>Lidl-Angebote Woche ab ${OFF.week}</b><div class="muted">Stand ${OFF.fetched} · Quelle: ${OFF.source}${ok ? '' : ' · <b>nicht für die geplante Woche (' + targetWeek() + ')</b>'}</div></div>`;
    const rows = OFF.items.map(x => `<tr><td>${x.name}${x.catalogId ? ' <span class="ok">· im Plan nutzbar</span>' : ''}<div class="muted">${x.info || ''}</div></td><td class="n"><b>${eur(x.price)}</b></td></tr>`).join('');
    return head + (rows ? `<div class="card"><table>${rows}</table></div>` : '') +
      '<p class="muted">Nur Lebensmittel. Artikel „im Plan nutzbar“ fließen mit ihrem Angebotspreis in Plan und Einkaufsliste ein.</p>';
  }

  function renderNav() {
    document.getElementById('nav').innerHTML = TABS.map(([k, l]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${l}</button>`).join('');
  }

  function planView() {
    if (S.plan && S.plan.recipes.length !== DAYS.length) S.plan = null;
    if (!S.plan) return `<div class="card"><p>Noch kein Plan. Ich wähle 4 vegetarische, proteinreiche Gerichte (Mo–Do Abendessen, je 2 Portionen: Rest als Mittag am Folgetag), die zusammen günstig einzukaufen sind und Angebote sowie Vorräte nutzen.</p><button class="primary" data-act="gen">Plan für nächsten Montag erstellen</button></div>`;
    const p = S.plan, ids = p.recipes;
    const cost = listCost(shoppingFor(ids));
    let rows = '';
    DAYS.forEach((d, i) => {
      const r = rec(ids[i]), prev = i > 0 ? rec(ids[i - 1]) : null;
      const lunch = prev ? `🍱 ${prev.name} <span class="muted">(Rest)</span>` : `<span class="muted">Einkaufstag, nichts geplant</span>`;
      rows += `<div class="card"><div class="row"><b>${d}</b><span class="muted">≈ ${Math.round(portionProtein(r))} g Protein / Portion</span></div>
        <div class="muted">☀️ Mittag: ${lunch}</div>
        <div class="row ${p.cooked[i] ? 'done' : ''}"><span>🍳 Abend: <b>${r.name}</b> <span class="muted">· ${r.min} Min</span></span>
        <button class="small" data-act="cook" data-i="${i}">${p.cooked[i] ? 'zurück' : 'gekocht ✓'}</button></div>
        <details><summary class="muted">Zutaten &amp; Zubereitung (2 Portionen)</summary><p class="muted">${Object.entries(r.ing).map(([id, a]) => `${a} ${cat(id).unit} ${cat(id).name}`).join(', ')}</p><p>${r.steps}</p></details></div>`;
    });
    const last = rec(ids[ids.length - 1]);
    rows += `<div class="card"><b>Freitag</b><div class="muted">☀️ Frühstück-Shake, Rest „${last.name}“ als Mittag oder mitnehmen. Danach bei den Eltern.</div></div>`;
    const stale = offersValid() ? `<span class="ok">Angebote vom ${OFF.fetched}</span>` : '<span class="warn">keine aktuellen Angebote geladen</span>';
    return `<div class="row"><div><b>Woche ab ${p.week}</b><div class="muted">Frühstück: Shake (fix) · Einkauf ≈ ${eur(cost)} · ${stale}</div></div><button data-act="gen">Neu würfeln</button></div>${rows}`;
  }

  function listView() {
    if (!S.plan) return '<div class="card">Erst einen Plan erstellen.</div>';
    const list = shoppingFor(S.plan.recipes), order = ['Obst & Gemüse', 'Brot', 'Kühlregal', 'Vorrat', 'Tiefkühl'];
    const est = list.some(x => cat(x.id).est && !(S.prices[x.id] && S.prices[x.id].confirmed));
    let html = `<div class="row"><b>Einkaufsliste Lidl · Montag ${S.plan.week}</b><span><b>${eur(listCost(list))}</b></span></div>`;
    if (est) html += `<p class="warn">Hinweis: Einige Preise sind Schätzwerte. Bitte im Tab „Preise“ mit Prospekt/Lidl-Plus abgleichen.</p>`;
    order.forEach(o => {
      const items = list.filter(x => cat(x.id).cat === o);
      if (!items.length) return;
      html += `<h2>${o}</h2><div class="card">` + items.map(x => {
        const c = cat(x.id);
        return `<div class="row"><span>${x.packs}× ${c.name} ${isOffer(x.id) ? '<b class="ok">· Angebot</b>' : ''}</span><span class="muted">${eur(x.cost)}</span></div>`;
      }).join('') + '</div>';
    });
    if (!list.length) html += '<div class="card ok">Alles im Vorrat vorhanden.</div>';
    html += S.plan.bought ? '<p class="ok">✓ Als eingekauft verbucht (Vorrat &amp; Ausgaben aktualisiert).</p>'
      : `<button class="primary" data-act="bought">Eingekauft – in Vorrat &amp; Ausgaben buchen</button>`;
    return html;
  }

  function pantryView() {
    const rows = Object.entries(S.pantry).filter(([, p]) => p.amount > 0).sort((a, b) => a[1].exp.localeCompare(b[1].exp));
    if (!rows.length) return '<div class="card">Vorrat ist leer. Nach dem Einkauf wird er automatisch gefüllt.</div>';
    const today = iso(new Date());
    return `<p class="muted">„gekocht ✓“ im Wochenplan bucht Zutaten automatisch ab. Hier nur für Abweichungen.</p><div class="card"><table>` +
      rows.map(([id, p]) => {
        const c = cat(id), soon = p.exp <= iso(addDays(new Date(), 3)), step = Math.max(1, Math.round(c.pack / 4));
        return `<tr><td>${c.name}<div class="muted ${soon ? 'warn' : ''}">${soon ? (p.exp < today ? 'abgelaufen' : 'bald ablaufend') : 'haltbar bis'} ${p.exp}</div></td>
          <td class="n"><b>${Math.round(p.amount)} ${c.unit}</b></td>
          <td><button class="small" data-act="adj" data-id="${id}" data-d="${-step}">−${step}</button>
          <button class="small" data-act="discard" data-id="${id}" title="weggeworfen">🗑</button></td></tr>`;
      }).join('') + '</table></div>';
  }

  function pricesView() {
    const rows = CATALOG.map(c => {
      const o = S.prices[c.id] || {};
      return `<tr><td>${c.name}<div class="muted">${c.cat}${c.est && !o.confirmed ? ' · <span class="warn">geschätzt</span>' : ''}</div></td>
        <td class="n"><input type="number" step="0.01" min="0" data-pf="price" data-id="${c.id}" value="${(o.price || c.price).toFixed(2)}"></td>
        <td class="n"><input type="number" step="0.01" min="0" placeholder="Angebot" data-pf="offer" data-id="${c.id}" value="${o.offer || ''}"></td></tr>`;
    }).join('');
    return `<p class="muted">Normalpreis und (optional) Wochenangebot je Packung. Angebotspreise bevorzugt der Planer automatisch. Nach Änderungen im Plan „Neu würfeln“.</p>
      <div class="card"><table><tr><th>Artikel</th><th>Preis €</th><th>Angebot €</th></tr>${rows}</table></div>
      <button data-act="clearoffers">Alle Angebote löschen (neue Woche)</button>
      <h2>Backup</h2><button data-act="export">Daten exportieren</button> <button data-act="import">Importieren</button><textarea id="io" style="width:100%;height:80px;margin-top:8px;display:none"></textarea>`;
  }

  function trackerView() {
    const total = S.history.reduce((s, h) => s + h.total, 0), n = S.history.length;
    const waste = S.waste.reduce((s, w) => s + w.value, 0);
    const cooked = S.plan ? S.plan.cooked.filter(Boolean).length * 2 : 0;
    return `<div class="grid"><div class="stat"><b>${eur(total)}</b>Ausgaben gesamt</div>
      <div class="stat"><b>${n ? eur(total / n) : '–'}</b>Ø pro Woche</div>
      <div class="stat"><b>${eur(waste)}</b>weggeworfen</div>
      <div class="stat"><b>${cooked}</b>Portionen diese Woche</div></div>
      <h2>Einkäufe</h2><div class="card">${n ? S.history.slice().reverse().map(h => `<div class="row"><span>${h.date}</span><span>${h.items} Artikel · ${eur(h.total)}</span></div>`).join('') : '<span class="muted">Noch keine Einkäufe verbucht. Der Durchschnitt hier wird die Basis für dein Wochenbudget.</span>'}</div>`;
  }

  function render() {
    renderNav();
    document.getElementById('weeklabel').textContent = S.plan ? 'Woche ab ' + S.plan.week : '';
    const v = { plan: planView, list: listView, offers: offersView, pantry: pantryView, prices: pricesView, tracker: trackerView }[tab]();
    document.getElementById('view').innerHTML = v;
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-t],[data-act]'); if (!t) return;
    if (t.dataset.t) { tab = t.dataset.t; return render(); }
    const a = t.dataset.act;
    if (a === 'gen') { generatePlan(); render(); }
    else if (a === 'bought') markBought();
    else if (a === 'cook') toggleCooked(+t.dataset.i);
    else if (a === 'adj') adjustPantry(t.dataset.id, +t.dataset.d);
    else if (a === 'discard') discard(t.dataset.id);
    else if (a === 'clearoffers') { Object.values(S.prices).forEach(p => delete p.offer); save(); render(); }
    else if (a === 'export') { const io = document.getElementById('io'); io.style.display = 'block'; io.value = JSON.stringify(S); io.select(); }
    else if (a === 'import') {
      const io = document.getElementById('io');
      if (io.style.display === 'none') { io.style.display = 'block'; io.value = ''; io.placeholder = 'Exportierten Text hier einfügen, dann nochmal „Importieren“'; return; }
      try { S = JSON.parse(io.value); save(); render(); } catch (err) { alert('Ungültige Daten'); }
    }
  });
  document.addEventListener('change', e => {
    const f = e.target.dataset.pf; if (!f) return;
    const id = e.target.dataset.id, v = parseFloat(e.target.value);
    const o = S.prices[id] = S.prices[id] || {};
    if (f === 'offer') { if (v > 0) o.offer = v; else delete o.offer; }
    else if (v > 0) { o.price = v; o.confirmed = true; }
    save();
  });

  render();
})();
