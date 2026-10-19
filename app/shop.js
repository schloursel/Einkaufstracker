// Einkauf (Ansicht + Laden-Modus) und Vorrat (Lagerorte, Füllstufen, Mindestbestand, Hinzufügen-Sheet).
(function () {
  const ET = window.ET, S = ET.S, esc = ET.esc, eur = ET.eur, item = ET.item, A = ET.acts;
  const ORDER = ['Obst & Gemüse', 'Brot', 'Kühlregal', 'Vorrat', 'Tiefkühl'];
  const r1 = n => Math.round(n * 10) / 10;
  ET.shopMode = false;
  let wake = null;
  async function setWake(on) {
    try {
      if (on && navigator.wakeLock && !wake) { wake = await navigator.wakeLock.request('screen'); wake.addEventListener('release', () => { wake = null; }); }
      else if (!on && wake) { await wake.release(); wake = null; }
    } catch (e) { wake = null; }
  }
  window.addEventListener('hashchange', () => { if (ET.route() !== 'shop') setWake(false); });

  // ---------- Einkauf ----------
  ET.views.shop = function () {
    const p = ET.ensurePlan(), list = ET.shoppingFor(ET.entries()), total = ET.listCost(list), budget = S.settings.budget, sav = ET.savings(list);
    const est = list.some(x => item(x.id).est && !(S.prices[x.id] && S.prices[x.id].confirmed));
    const mode = ET.shopMode;
    let html = `<div class="row" style="margin:6px 0"><div class="seg"><button class="${!mode ? 'on' : ''}" data-act="shopMode" data-m="0">Ansicht</button><button class="${mode ? 'on' : ''}" data-act="shopMode" data-m="1">Laden-Modus</button></div><b>${eur(total)}</b></div>`;
    if (budget && ET.weekCost() > budget) html += `<div class="bad" style="margin:2px 0 6px">${eur(ET.weekCost() - budget)} über dem Wochenbudget</div>`;
    if (ET.filled() < ET.slotCount()) html += '<div class="banner"><span>Der Plan ist noch nicht komplett, die Liste enthält bisher Shake und Mindestbestände.</span><button class="small" data-act="go" data-r="plan">Zum Plan</button></div>';
    if (!list.length) html += '<div class="card ok">Alles im Vorrat vorhanden.</div>';

    html += afterWeekHtml(true);
    const row = (x, big) => {
      const c = item(x.id), have = ET.pantryAmt(x.id), on = !!p.checked[x.id], min = S.minStock[x.id] > 0;
      const name = `${x.packs}× ${esc(c.name)}`, tags = `${ET.isOffer(x.id) ? ' <b class="ok">· Angebot</b>' : ''}${c.packUnsure ? ' <span class="badge warn">Packung unklar</span>' : ''}`;
      const detail = big ? '' : `<div class="muted">${r1(x.amount)} ${c.unit}${have ? ' · Vorrat ' + r1(have) + ' ' + c.unit : ''}</div>`;
      return `<div class="shoprow ${big ? 'big' : ''}" data-act="${mode ? 'tick' : 'noop'}" data-id="${esc(x.id)}">${mode ? ET.ui.check(on) : ''}<div class="t ${on ? 'done' : ''}">${name}${tags}${detail}</div><span class="muted">${eur(x.cost)}</span></div>`;
    };
    if (!mode) {
      ORDER.forEach(o => {
        const items = list.filter(x => item(x.id).cat === o); if (!items.length) return;
        html += `<h2>${o}</h2><div class="card" style="padding:4px 14px">${items.map(x => row(x, false)).join('')}</div>`;
      });
    } else {
      const open = list.filter(x => !p.checked[x.id]), done = list.filter(x => p.checked[x.id]);
      ORDER.forEach(o => {
        const items = open.filter(x => item(x.id).cat === o); if (!items.length) return;
        html += `<h2>${o}</h2><div class="card" style="padding:4px 14px">${items.map(x => row(x, true)).join('')}</div>`;
      });
      if (done.length) html += `<h2>Im Wagen (${done.length})</h2><div class="card" style="padding:4px 14px">${done.map(x => row(x, true)).join('')}</div>`;
    }
    const nChecked = list.filter(x => p.checked[x.id]).length;
    html += '<div style="margin:12px 0"><button class="small" data-act="padOpen">+ Zusätzlich gekauft (zum Vorrat)</button></div>';
    html += p.bought ? '<p class="ok">✓ Als eingekauft verbucht (Vorrat und Ausgaben aktualisiert).</p>'
      : (list.length ? `<button class="primary block" data-act="bought">${nChecked ? nChecked + ' abgehakte Artikel' : 'Alles'} als eingekauft buchen</button>` : '');
    return { title: 'Einkauf', sub: 'Montag ' + p.week.split('-').reverse().join('.'), html };
  };
  A.noop = () => {};
  A.shopMode = t => { ET.shopMode = t.dataset.m === '1'; setWake(ET.shopMode); ET.render(); };
  A.tick = t => { const p = S.plan, id = t.dataset.id; p.checked[id] = !p.checked[id]; ET.save(); ET.render(); };
  A.bought = () => { ET.markBought(); ET.render(); };

  // ---------- Vorrat ----------
  const LOC = [['kuehl', 'Kühlschrank'], ['gefrier', 'Gefrierfach'], ['vorrat', 'Vorratsschrank']];
  const fill = loc => `<span class="fill">${[1, 2, 3, 4, 5].map(v => `<i class="${v <= S.fill[loc] ? 'on' : ''}" data-act="fill" data-loc="${loc}" data-v="${v}" title="Füllstand ${v}/5"></i>`).join('')}</span>`;
  const fmtQ = (n, c) => r1(n) + ' ' + c.unit;
  const fmtD = d => d.split('-').reverse().slice(0, 2).join('.') + '.';
  function afterWeekHtml(compact) {
    const rows = ET.afterWeek(); if (!rows.length) return '';
    const empty = rows.filter(x => x.left === 0 && x.use > 0);
    const rest = rows.filter(x => x.left > 0), spoilIds = new Set(rest.filter(x => x.soon).map(x => x.id));
    const sum = `${empty.length} gehen leer · ${rest.length} bleiben übrig${ET.filled() < ET.slotCount() ? ' (Plan noch nicht komplett)' : ''}`;
    let h = compact ? `<details class="card"><summary style="margin:0"><b>Nach der Woche</b> · ${sum}</summary>` : `<div class="card"><h3>Nach der Woche</h3><div class="muted">${sum}</div>`;
    if (empty.length) h += `<div style="margin-top:10px"><b>Geht leer</b><div class="muted">${empty.map(x => esc(x.c.name)).join(', ')}</div></div>`;
    if (spoilIds.size) h += `<div style="margin-top:10px"><b class="warn">Läuft ab, bleibt aber übrig</b>${rest.filter(x => spoilIds.has(x.id)).map(x => `<div class="row nowrap" style="padding:3px 0"><span>${esc(x.c.name)}</span><span class="warn" style="flex:none">${fmtQ(x.left, x.c)} · bis ${fmtD(x.exp)}</span></div>`).join('')}</div>`;
    const others = rest.filter(x => !spoilIds.has(x.id)).sort((a, b) => a.c.name.localeCompare(b.c.name, 'de'));
    if (others.length) h += `<details><summary>Bleibt übrig (${others.length})</summary><table>${others.map(x => `<tr><td>${esc(x.c.name)}</td><td class="n"><b>${fmtQ(x.left, x.c)}</b></td></tr>`).join('')}</table></details>`;
    h += '<button class="block" style="margin-top:12px" data-act="reuseOpen">Gerichte für die Reste vorschlagen</button>';
    return h + (compact ? '</details>' : '</div>');
  }
  ET.views.pantry = function () {
    const p = ET.ensurePlan(), today = ET.iso(ET.today()), soonIso = ET.iso(ET.addDays(ET.today(), 3));
    let html = `<div class="row" style="margin:6px 0"><button class="primary" data-act="padOpen">+ Hinzufügen</button><button class="${p.pantryChecked ? 'on' : ''}" data-act="pantryDone">${p.pantryChecked ? '✓ Vorrat geprüft' : 'Vorrat ist geprüft'}</button></div>`;
    const all = Object.entries(S.pantry).filter(([, q]) => q.amount > 0);
    const urgent = all.filter(([, q]) => q.exp && q.exp <= soonIso).sort((x, y) => x[1].exp.localeCompare(y[1].exp));
    if (urgent.length) html += '<div class="card"><h3>Zuerst verbrauchen</h3>' + urgent.map(([id, q]) => {
      const days = Math.round((ET.parseIso(q.exp) - ET.today()) / 864e5);
      return `<div class="row nowrap" style="padding:4px 0" data-act="itemOpen" data-id="${esc(id)}"><span>${esc(item(id).name)}</span><span class="${days < 0 ? 'bad' : 'warn'}">${days < 0 ? 'abgelaufen' : days === 0 ? 'heute' : days === 1 ? 'morgen' : 'in ' + days + ' Tagen'}</span></div>`;
    }).join('') + '</div>';
    html += afterWeekHtml();
    if (!all.length) html += '<div class="card">Vorrat ist leer. Nach dem Einkauf füllt er sich automatisch, oder du fügst oben etwas hinzu.</div>';
    LOC.forEach(([loc, label]) => {
      const rows = all.filter(([id]) => ET.storageOf(id) === loc).sort((a, b) => (a[1].exp || '').localeCompare(b[1].exp || ''));
      if (!rows.length) return;
      html += `<h2>${label}</h2><div class="card" style="padding:4px 14px"><table>` + rows.map(([id, q]) => {
        const c = item(id), step = Math.max(1, Math.round(c.pack / 4));
        return `<tr><td><span data-act="itemOpen" data-id="${esc(id)}" style="cursor:pointer">${esc(c.name)}</span></td>
          <td class="n"><b>${r1(q.amount)} ${c.unit}</b></td>
          <td style="white-space:nowrap"><button class="small" data-act="adj" data-id="${esc(id)}" data-d="${-step}">−</button> <button class="small" data-act="adj" data-id="${esc(id)}" data-d="${step}">+</button></td></tr>`;
      }).join('') + '</table></div>';
    });
    html += `<details class="card"><summary style="margin:0">Füllstand Kühlschrank und Gefrierfach</summary><div class="row" style="margin-top:8px"><span>Kühlschrank</span>${fill('kuehl')}</div><div class="row" style="margin-top:6px"><span>Gefrierfach</span>${fill('gefrier')}</div></details>`;
    return { title: 'Vorrat', sub: '', html };
  };
  A.fill = t => { const loc = t.dataset.loc, v = +t.dataset.v; S.fill[loc] = S.fill[loc] === v ? 0 : v; ET.save(); ET.render(); };
  A.pantryDone = () => { const p = ET.ensurePlan(); p.pantryChecked = !p.pantryChecked; ET.save(); ET.render(); };
  A.adj = t => { const q = S.pantry[t.dataset.id]; if (q) { q.amount = Math.max(0, q.amount + +t.dataset.d); ET.save(); ET.render(); } };

  // Artikel-Sheet (Lagerort, Mindestbestand, Haltbarkeit, Wegwerfen)
  let curItem = null;
  A.itemOpen = t => { curItem = t.dataset.id; ET.sheet.open(item(curItem).name, itemHtml); };
  function itemHtml() {
    const id = curItem, c = item(id), q = S.pantry[id] || { amount: 0, exp: '' };
    return `<div class="muted">${r1(q.amount)} ${c.unit} im Vorrat</div>
      <label class="field">Lagerort</label><select data-f="storage">${LOC.map(([k, l]) => `<option value="${k}" ${ET.storageOf(id) === k ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <label class="field">Mindestbestand (${c.unit}); darunter kommt der Artikel auf die Einkaufsliste</label><input data-f="min" type="number" min="0" step="any" value="${S.minStock[id] || ''}" placeholder="kein Mindestbestand">
      <label class="field">Haltbar bis</label><input data-f="exp" type="date" value="${esc(q.exp || '')}">
      <div class="row" style="margin-top:16px"><button data-act="discardAsk">Weggeworfen …</button><button data-act="itemRemove">Aus Vorrat entfernen</button></div>`;
  }
  ET.onChange(e => {
    const f = e.target.dataset.f; if (!curItem || !f || !['storage', 'min', 'exp'].includes(f)) return;
    const id = curItem;
    if (f === 'storage') S.storage[id] = e.target.value;
    else if (f === 'min') { const v = parseFloat(e.target.value); if (v > 0) S.minStock[id] = v; else delete S.minStock[id]; }
    else if (f === 'exp' && S.pantry[id]) S.pantry[id].exp = e.target.value;
    ET.save(); ET.render();
  });
  A.discardAsk = () => ET.sheet.open('Warum weggeworfen?', () => ['verdorben', 'zu viel gekauft', 'mag ich nicht mehr', 'sonstiges'].map(r => `<button class="block" style="margin:6px 0" data-act="discard" data-r="${r}">${r}</button>`).join(''));
  A.discard = t => { ET.discard(curItem, t.dataset.r); ET.sheet.close(); ET.render(); };
  A.itemRemove = () => { if (S.pantry[curItem]) S.pantry[curItem].amount = 0; ET.save(); ET.sheet.close(); ET.render(); };

  // Hinzufügen-Sheet
  const PS = { tab: 'cat', q: '', sel: null, amt: '', exp: '', cname: '', cunit: 'g', cstorage: 'vorrat' };
  ET.padOpen = function (selId) {
    Object.assign(PS, { tab: selId && selId.startsWith('p:') ? 'prod' : 'cat', q: '', sel: null, amt: '', exp: '', cname: '', cunit: 'g', cstorage: 'vorrat' });
    if (selId) selectItem(selId); else selectItem(CATALOG[0].id);
    ET.sheet.open('Zum Vorrat hinzufügen', padHtml);
  };
  A.padOpen = () => ET.padOpen();
  function selectItem(id) { const c = item(id); PS.sel = id; PS.amt = c.pack; PS.exp = ET.iso(ET.addDays(ET.today(), c.shelf)); }
  function prodResults() {
    const terms = ET.normS(PS.q).split(/\s+/).filter(Boolean); if (!terms.length) return '<div class="muted" style="padding:8px 0">Suchbegriff eingeben (7.000+ Lidl-Produkte).</div>';
    const rows = (window.PRODUCTS ? PRODUCTS.items : []).filter(x => terms.every(t => ET.normS(x[1]).includes(t))).slice(0, 30);
    return rows.length ? rows.map(x => `<div class="shoprow" data-act="padPick" data-id="p:${x[0]}"><div class="t">${esc(x[1])}<div class="muted">${esc(x[2])}${x[3] ? ' · ' + esc(x[3]) : ''}</div></div><span class="muted">${eur(x[4])}</span></div>`).join('') : '<div class="muted">Nichts gefunden.</div>';
  }
  function padHtml() {
    const tabs = [['cat', 'Katalog'], ['prod', 'Lidl-Produkt'], ['own', 'Eigener Artikel']];
    let h = `<div class="seg" style="margin:6px 0">${tabs.map(([k, l]) => `<button class="${PS.tab === k ? 'on' : ''}" data-act="padTab" data-t="${k}">${l}</button>`).join('')}</div>`;
    if (PS.tab === 'cat') h += `<label class="field">Artikel</label><select data-f="padcat">${CATALOG.map(c => `<option value="${c.id}" ${PS.sel === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>`;
    else if (PS.tab === 'prod') {
      h += `<input id="pprodq" type="search" placeholder="Produkt suchen" value="${esc(PS.q)}" style="margin-top:8px"><div id="pprodres">${prodResults()}</div>`;
      if (PS.sel && PS.sel.startsWith('p:')) h += `<div class="card"><b>${esc(item(PS.sel).name)}</b><div class="muted">${esc(item(PS.sel).packText || '')}${item(PS.sel).packUnsure ? ' · Packung unklar, Menge bitte prüfen' : ''}</div></div>`;
    } else h += `<label class="field">Name</label><input data-f="cname" value="${esc(PS.cname)}" placeholder="z. B. Olivenöl"><div class="grid2"><div><label class="field">Einheit</label><select data-f="cunit">${['g', 'ml', 'Stk'].map(u => `<option ${PS.cunit === u ? 'selected' : ''}>${u}</option>`).join('')}</select></div><div><label class="field">Lagerort</label><select data-f="cstorage">${LOC.map(([k, l]) => `<option value="${k}" ${PS.cstorage === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>`;
    const showAmt = PS.tab === 'own' || PS.sel;
    if (showAmt) h += `<div class="grid2"><div><label class="field">Menge${PS.tab === 'own' ? '' : ' (' + item(PS.sel).unit + ')'}</label><input data-f="pamt" type="number" min="0" step="any" value="${esc(PS.amt)}"></div><div><label class="field">Haltbar bis</label><input data-f="pexp" type="date" value="${esc(PS.exp)}"></div></div><button class="primary block" style="margin-top:14px" data-act="padAdd">Hinzufügen</button>`;
    return h;
  }
  A.padTab = t => { PS.tab = t.dataset.t; if (PS.tab === 'cat') selectItem(CATALOG[0].id); else if (PS.tab === 'prod') { PS.sel = null; PS.amt = ''; PS.exp = ''; } else { PS.sel = null; PS.amt = ''; PS.exp = ET.iso(ET.addDays(ET.today(), 7)); } ET.sheet.refresh(); };
  A.padPick = t => { selectItem(t.dataset.id); ET.sheet.refresh(); };
  ET.onInput(e => {
    if (e.target.id === 'pprodq') { PS.q = e.target.value; document.getElementById('pprodres').innerHTML = prodResults(); }
    const f = e.target.dataset.f;
    if (f === 'pamt') PS.amt = e.target.value; else if (f === 'pexp') PS.exp = e.target.value; else if (f === 'cname') PS.cname = e.target.value;
  });
  ET.onChange(e => {
    const f = e.target.dataset.f;
    if (f === 'padcat') { selectItem(e.target.value); ET.sheet.refresh(); }
    else if (f === 'cunit') PS.cunit = e.target.value; else if (f === 'cstorage') PS.cstorage = e.target.value;
  });
  A.padAdd = () => {
    const amt = parseFloat(PS.amt); if (!(amt > 0)) return alert('Bitte eine Menge eingeben.');
    let id = PS.sel;
    if (PS.tab === 'own') {
      const name = PS.cname.trim(); if (!name) return alert('Bitte einen Namen eingeben.');
      const ex = S.customItems.find(c => ET.normS(c.name) === ET.normS(name) && c.unit === PS.cunit);
      if (ex) id = ex.id; else { id = ET.uid('x'); S.customItems.push({ id, name, unit: PS.cunit, pack: amt, price: 0, n: null, shelf: 7, storage: PS.cstorage, cat: 'Vorrat' }); }
    }
    if (!id) return alert('Bitte einen Artikel wählen.');
    ET.addPantry(id, amt, PS.exp); ET.sheet.close(); ET.render();
  };
})();
