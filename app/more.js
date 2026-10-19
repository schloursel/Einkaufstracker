// Mehr: Menü, Angebote, Alle Produkte, Rezepte (inkl. eigene), Preise, Tracker, Einstellungen, Backup, Info, Einrichtung.
(function () {
  const ET = window.ET, S = ET.S, esc = ET.esc, eur = ET.eur, item = ET.item, A = ET.acts, fmtN = ET.fmtN;
  const PROD = window.PRODUCTS || { items: [], fetched: '', source: '' };
  const NUTRI = window.NUTRI || {};
  const r1 = n => Math.round(n * 10) / 10;
  const TOOLS = [['herd', 'Herd'], ['backofen', 'Backofen'], ['mikro', 'Mikrowelle'], ['airfryer', 'Airfryer'], ['mixer', 'Mixer / Stabmixer'], ['reiskocher', 'Reiskocher']];
  const ALLERGENS = [['laktose', 'Laktose'], ['gluten', 'Gluten'], ['nuesse', 'Nüsse'], ['soja', 'Soja']];

  // ---------- Menü ----------
  const LINKS = [['offers', 'Angebote', 'Wochenangebote bei Lidl'], ['recipes', 'Gerichte & eigene Rezepte', ''], ['settings', 'Einstellungen', 'Ziele, Budget, Küche, Erinnerungen']];
  const MORE_LINKS = [['products', 'Alle Produkte', 'Lidl-Sortiment mit Nährwerten'], ['prices', 'Preise & Katalog', ''], ['tracker', 'Tracker', 'Ausgaben, Wegwurf, Eiweiß und kcal'], ['backup', 'Backup', 'Export und Import'], ['info', 'Info & Quellen', '']];
  const linkRows = ls => ls.map(([k, t, s]) => `<div class="list-link" data-act="go" data-r="more/${k}"><div><b>${t}</b>${s ? `<div class="muted">${s}</div>` : ''}</div><span class="muted">›</span></div>`).join('');
  ET.views.more = () => ({ title: 'Mehr', sub: '', html: `<div class="card" style="padding:4px 16px">${linkRows(LINKS)}</div>
    <details class="card" style="padding:12px 16px"><summary style="margin:0">Weiteres</summary><div style="margin-top:6px">${linkRows(MORE_LINKS)}</div></details>` });

  // ---------- Angebote ----------
  ET.views['more/offers'] = function () {
    const OFF = ET.OFF, ok = ET.offersValid();
    const head = !OFF.items.length ? '<div class="card warn">Noch keine Angebote geladen.</div>'
      : `<div class="card ${ok ? '' : 'warn'}"><b>Lidl-Angebote Woche ab ${esc(OFF.week)}</b><div class="muted">Stand ${esc(OFF.fetched)} · ${esc(OFF.source)}${ok ? '' : ' · <b>nicht für die geplante Woche (' + ET.targetWeek() + ')</b>'}</div></div>`;
    const rows = OFF.items.map(x => {
      const c = x.catalogId && item(x.catalogId), n = c && c.n ? `<div class="muted">pro ${c.unit === 'Stk' ? 'Stück' : '100 ' + c.unit}: ${Math.round(c.n[0])} kcal · ${c.n[1]} g Eiweiß</div>` : '';
      return `<tr><td>${esc(x.name)}${x.catalogId ? ' <span class="ok">· im Plan nutzbar</span>' : ''}<div class="muted">${esc(x.info || '')}</div></td><td class="n"><b>${eur(x.price)}</b></td></tr>`;
    }).join('');
    return { title: 'Angebote', html: head + (rows ? `<div class="card"><table>${rows}</table></div>` : '') + '' };
  };

  // ---------- Alle Produkte ----------
  const nutriLine = n => Array.isArray(n) ? `pro 100 g: ${Math.round(n[0])} kcal · ${n[1]} g Eiweiß · ${n[2]} g KH · ${n[3]} g Fett${n[4] ? ' · ' + n[4] + ' g Ballast.' : ''}` : 'Nährwerte noch nicht erfasst';
  function productRows(q, c, sort, onlyN) {
    const terms = ET.normS(q).split(/\s+/).filter(Boolean);
    let r = PROD.items.filter(x => (!c || x[2] === c) && (!onlyN || Array.isArray(NUTRI[x[0]])) && terms.every(t => ET.normS(x[1]).includes(t)));
    if (sort === 'preis') r = r.slice().sort((a, b) => a[4] - b[4]);
    else if (sort === 'eiweiss') r = r.filter(x => Array.isArray(NUTRI[x[0]])).sort((a, b) => NUTRI[b[0]][1] - NUTRI[a[0]][1]);
    const shown = r.slice(0, 120);
    return `<div class="muted">${r.length} Treffer${r.length > shown.length ? ' (erste 120, Suche eingrenzen)' : ''}</div><div class="card" style="padding:4px 14px"><table>` +
      shown.map(x => `<tr data-act="prodOpen" data-id="${x[0]}" style="cursor:pointer"><td>${esc(x[1])}<div class="muted">${esc(x[2])}${x[3] ? ' · ' + esc(x[3]) : ''}</div><div class="muted">${nutriLine(NUTRI[x[0]])}</div></td><td class="n"><b>${eur(x[4])}</b></td></tr>`).join('') + '</table></div>';
  }
  ET.views['more/products'] = function () {
    if (!PROD.items.length) return { title: 'Alle Produkte', html: '<div class="card warn">Noch keine Produktliste geladen (products.js).</div>' };
    const cats = [...new Set(PROD.items.map(x => x[2]))].sort(), nn = Object.values(NUTRI).filter(Array.isArray).length;
    return { title: 'Alle Produkte', html: `<div class="card"><b>${PROD.items.length} Lidl-Produkte</b><div class="muted">Stand ${esc(PROD.fetched)} · ${esc(PROD.source)} · Nährwerte für ${nn} Produkte erfasst (wächst Woche für Woche)</div></div>
      <div class="row"><input id="pq" type="search" placeholder="Suchen, z. B. Skyr, Linsen, Tofu" style="flex:2 1 200px">
      <select id="pc" style="flex:1 1 150px"><option value="">Alle Kategorien</option>${cats.map(c => `<option>${esc(c)}</option>`).join('')}</select>
      <select id="ps" style="flex:1 1 120px"><option value="">Name</option><option value="preis">Preis aufsteigend</option><option value="eiweiss">Eiweiß absteigend</option></select></div>
      <label class="muted"><input id="pn" type="checkbox"> nur mit Nährwerten</label><div id="pres">${productRows('', '', '', false)}</div>` };
  };
  ET.onInput(e => { if (['pq', 'pc', 'ps', 'pn'].includes(e.target.id)) document.getElementById('pres').innerHTML = productRows(document.getElementById('pq').value, document.getElementById('pc').value, document.getElementById('ps').value, document.getElementById('pn').checked); });
  ET.onChange(e => { if (['pc', 'ps', 'pn'].includes(e.target.id)) document.getElementById('pres').innerHTML = productRows(document.getElementById('pq').value, document.getElementById('pc').value, document.getElementById('ps').value, document.getElementById('pn').checked); });
  let curProd = null;
  A.prodOpen = t => { curProd = t.dataset.id; const c = item('p:' + curProd); ET.sheet.open(c.name, () => {
    const c2 = item('p:' + curProd), n = NUTRI[curProd];
    return `<div class="muted">${esc(c2.pcat)} · ${esc(c2.packText || '')}</div><div class="card"><div class="row"><span>Preis (zuletzt gemeldet)</span><b>${eur(c2.price)}</b></div></div>
      <div class="card"><h3>Nährwerte pro 100 g</h3>${Array.isArray(n) ? `<div class="grid2"><div>Energie</div><div><b>${Math.round(n[0])} kcal</b></div><div>Eiweiß</div><div><b>${n[1]} g</b></div><div>Kohlenhydrate</div><div><b>${n[2]} g</b></div><div>Fett</div><div><b>${n[3]} g</b></div><div>Ballaststoffe</div><div><b>${n[4]} g</b></div></div>` : '<div class="muted">Noch nicht erfasst. Der wöchentliche Lauf ergänzt sie nach und nach.</div>'}</div>
      <div class="row"><button class="primary" data-act="prodToPantry">Zum Vorrat</button><button data-act="prodAsIng">Als Zutat verwenden</button></div>`; }); };
  A.prodToPantry = () => { ET.sheet.close(); setTimeout(() => ET.padOpen('p:' + curProd), 270); };
  A.prodAsIng = () => { ET.sheet.close(); setTimeout(() => openForm(null, 'p:' + curProd), 270); };

  // ---------- Rezepte ----------
  let RL = 'all', RQ = '';
  const RTYPES = [['all', 'Alle'], ['meal', 'Gerichte'], ['snack', 'Snacks'], ['einfach', 'einfach'], ['dip', 'Dips'], ['eintopf', 'Ein-Topf']];
  ET.views['more/recipes'] = function () {
    return { title: 'Gerichte', html: `<div class="row" style="margin:6px 0"><button class="primary" data-act="recNew">+ Neues Rezept</button><span class="muted" id="rcount"></span></div>
      <input id="rq" type="search" placeholder="Rezept suchen" value="${esc(RQ)}" style="margin-bottom:6px">
      <div class="chips">${RTYPES.map(([k, l]) => ET.ui.chip(l, RL === k, 'rlType', `data-t="${k}"`)).join('')}</div><div id="rlist">${recList(RQ)}</div>` };
  };
  function recList(q) {
    const t = ET.normS(q);
    const rs = ET.allRecipes().filter(r => (!t || ET.normS(r.name).includes(t) || Object.keys(r.ing).some(id => ET.normS(item(id).name).includes(t))) &&
      (RL === 'all' || (RL === 'snack' ? r.type === 'snack' : RL === 'meal' ? r.type !== 'snack' : (r.tags || []).includes(RL))));
    return `<div class="muted">${rs.length} Rezepte</div><div class="card" style="padding:4px 14px">` + rs.map(r => {
      const fl = ET.recipeFlags(r), n = ET.portionN(r);
      return `<div class="list-link" data-act="recView" data-id="${r.id}"><div><b>${esc(r.name)}</b>${r.custom ? ' <span class="badge">eigenes</span>' : ''}${r.type === 'snack' ? ' <span class="badge">Snack</span>' : ''}<div class="muted">${r.min} Min · ${Math.round(n[1])} g Eiweiß${fl.blocked ? ' · <span class="warn">Gerät fehlt</span>' : ''}${fl.warn ? ' · <span class="warn">⚠ ' + fl.aHit.concat(fl.dHit).map(esc).join(', ') + '</span>' : ''}</div></div><span class="muted">›</span></div>`;
    }).join('') + '</div>';
  }
  ET.onInput(e => { if (e.target.id === 'rq') { RQ = e.target.value; document.getElementById('rlist').innerHTML = recList(RQ); } });
  A.rlType = t => { RL = t.dataset.t; ET.render(); };
  A.recView = t => ET.openRecipe(t.dataset.id, null);
  A.recNew = () => openForm(null);
  A.recEdit = () => { const id = ET._recId; ET.sheet.close(); setTimeout(() => openForm(id), 270); };
  A.recDelete = () => {
    const id = ET._recId; if (!confirm('Dieses Rezept löschen?')) return;
    if (S.plan) S.plan.days.forEach(d => { ['a', 'b'].forEach(k => { if (d[k] === id) { d[k] = null; } }); });
    S.customRecipes = S.customRecipes.filter(r => r.id !== id); ET.save(); ET.sheet.close(); ET.render();
  };

  // Rezept-Formular
  let RF = null;
  function openForm(id, addItem) {
    const src = id ? S.customRecipes.find(r => r.id === id) : null;
    RF = { id: id || null, type: src && src.type === 'snack' ? 'snack' : 'meal', tags: src ? (src.tags || []).slice() : [], name: src ? src.name : '', min: src ? src.min : 20, steps: src ? src.steps : '', tools: src ? src.tools.slice() : ['herd'], allergens: src ? (src.allergens || []).slice() : [],
      ing: src ? Object.assign({}, src.ing) : {}, q: '', own: null };
    if (addItem) RF.ing[addItem] = defaultAmt(addItem);
    ET.sheet.open(id ? 'Rezept bearbeiten' : 'Neues Rezept', formHtml);
  }
  const defaultAmt = id => { const c = item(id); return c.unit === 'Stk' ? 2 : Math.min(c.pack, 200); };
  function formResults() {
    const t = ET.normS(RF.q).split(/\s+/).filter(Boolean); if (!t.length) return '<div class="muted" style="padding:6px 0">Suchbegriff eingeben (Katalog, eigene Artikel, Lidl-Produkte).</div>';
    const own = S.customItems.map(c => ['x' + c.id.slice(1), c.name, 'eigener Artikel']).map((x, i) => [S.customItems[i].id, x[1], x[2]]);
    const cat = CATALOG.map(c => [c.id, c.name, 'Katalog']);
    const prod = PROD.items.filter(x => t.every(w => ET.normS(x[1]).includes(w))).slice(0, 40).map(x => ['p:' + x[0], x[1], x[2]]);
    const all = own.concat(cat).filter(x => t.every(w => ET.normS(x[1]).includes(w))).concat(prod).slice(0, 18);
    return all.length ? all.map(x => `<div class="shoprow" data-act="rfAdd" data-id="${esc(x[0])}"><div class="t">${esc(x[1])}<div class="muted">${esc(x[2])}</div></div><span class="muted">＋</span></div>`).join('') : '<div class="muted">Nichts gefunden. Unten eine eigene Zutat anlegen.</div>';
  }
  function formHtml() {
    const ni = ET.ingNutri(RF.ing), por = formPortion();
    let h = `<label class="field">Name</label><input data-f="rf-name" value="${esc(RF.name)}" placeholder="z. B. Linsen-Pfanne">
      <div class="chips" style="margin-top:10px">${ET.ui.chip('Gericht (2 Portionen)', RF.type === 'meal', 'rfType', 'data-k="meal"')}${ET.ui.chip('Snack (1 Portion)', RF.type === 'snack', 'rfType', 'data-k="snack"')}${ET.ui.chip('einfach', RF.tags.includes('einfach'), 'rfTag', 'data-k="einfach"')}${ET.ui.chip('Dip', RF.tags.includes('dip'), 'rfTag', 'data-k="dip"')}${ET.ui.chip('Ein-Topf', RF.tags.includes('eintopf'), 'rfTag', 'data-k="eintopf"')}</div>
      <div class="grid2"><div><label class="field">Kochzeit (Min)</label><input data-f="rf-min" type="number" min="1" value="${RF.min}"></div></div>
      <label class="field">Benötigte Geräte</label><div class="chips">${TOOLS.map(([k, l]) => ET.ui.chip(l, RF.tools.includes(k), 'rfTool', `data-k="${k}"`)).join('')}</div>
      <label class="field">Enthält (Unverträglichkeiten)</label><div class="chips">${ALLERGENS.map(([k, l]) => ET.ui.chip(l, RF.allergens.includes(k), 'rfAl', `data-k="${k}"`)).join('')}</div>
      <label class="field">Zutaten (Menge für ${RF.type === 'snack' ? '1 Portion' : '2 Portionen'})</label>`;
    const ids = Object.keys(RF.ing);
    h += ids.length ? '<div class="card" style="padding:4px 12px">' + ids.map(id => { const c = item(id); return `<div class="row nowrap" style="padding:6px 0;border-bottom:1px solid var(--line)"><span class="t" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.name)}${c.n ? '' : ' <span class="badge warn">ohne Nährwerte</span>'}</span><input data-f="rf-amt" data-id="${esc(id)}" type="number" min="0" step="any" value="${RF.ing[id]}" style="width:90px"><span class="muted" style="width:28px">${c.unit}</span><button class="small ghost" data-act="rfDel" data-id="${esc(id)}">✕</button></div>`; }).join('') + '</div>' : '<div class="muted">Noch keine Zutaten.</div>';
    h += `<input id="rfq" type="search" placeholder="Zutat suchen und antippen" value="${esc(RF.q)}" style="margin-top:8px"><div id="rfres">${formResults()}</div>
      <div class="row" style="margin:6px 0"><button class="small" data-act="rfOwn">${RF.own ? '▾ Eigene Zutat' : '＋ Eigene Zutat anlegen'}</button></div>`;
    if (RF.own) { const o = RF.own; h += `<div class="card"><div class="grid2"><div><label class="field">Name</label><input data-f="ro-name" value="${esc(o.name)}"></div><div><label class="field">Einheit</label><select data-f="ro-unit">${['g', 'ml', 'Stk'].map(u => `<option ${o.unit === u ? 'selected' : ''}>${u}</option>`).join('')}</select></div>
      <div><label class="field">Packungsgröße</label><input data-f="ro-pack" type="number" step="any" value="${o.pack}"></div><div><label class="field">Preis je Packung (€)</label><input data-f="ro-price" type="number" step="0.01" value="${o.price}"></div>
      <div><label class="field">Haltbarkeit (Tage)</label><input data-f="ro-shelf" type="number" value="${o.shelf}"></div><div><label class="field">Lagerort</label><select data-f="ro-storage">${[['kuehl', 'Kühlschrank'], ['gefrier', 'Gefrierfach'], ['vorrat', 'Vorratsschrank']].map(([k, l]) => `<option value="${k}" ${o.storage === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
      <div class="muted" style="margin-top:6px">Nährwerte je ${o.unit === 'Stk' ? 'Stück' : '100 ' + o.unit} (leer lassen, wenn unbekannt)</div>
      <div class="grid2">${[['kcal', 'kcal'], ['p', 'Eiweiß g'], ['c', 'Kohlenhydrate g'], ['f', 'Fett g'], ['fi', 'Ballaststoffe g']].map(([k, l]) => `<div><label class="field">${l}</label><input data-f="ro-${k}" type="number" step="any" value="${o[k]}"></div>`).join('')}</div>
      <button class="primary block" style="margin-top:10px" data-act="rfCreate">Zutat anlegen und hinzufügen</button></div>`; }
    h += `<label class="field">Zubereitung</label><textarea data-f="rf-steps" placeholder="Kurze Schritte">${esc(RF.steps)}</textarea>
      <div class="card" id="rfnut"><h3>Pro Portion</h3><div class="muted">${fmtN(por)}</div>${ni.unknown.length ? '<div class="warn" style="font-size:.85rem">Nährwerte unvollständig</div>' : ''}</div>
      <button class="primary block" data-act="rfSave">Speichern</button>`;
    return h;
  }
  const formPortion = () => ET.portionN({ ing: RF.ing, type: RF.type === 'snack' ? 'snack' : 'meal', serv: RF.type === 'snack' ? 1 : 2 });
  function refreshNut() { const el = document.getElementById('rfnut'); if (!el) return; const ni = ET.ingNutri(RF.ing); el.innerHTML = `<h3>Pro Portion</h3><div class="muted">${fmtN(formPortion())}</div>${ni.unknown.length ? '<div class="warn" style="font-size:.85rem">Nährwerte unvollständig</div>' : ''}`; }
  A.rfType = t => { RF.type = t.dataset.k; ET.sheet.refresh(); };
  A.rfTag = t => { const k = t.dataset.k, a = RF.tags; a.includes(k) ? a.splice(a.indexOf(k), 1) : a.push(k); ET.sheet.refresh(); };
  ET.onInput(e => {
    if (!RF) return; const f = e.target.dataset.f, id = e.target.id;
    if (id === 'rfq') { RF.q = e.target.value; document.getElementById('rfres').innerHTML = formResults(); return; }
    if (!f) return;
    if (f === 'rf-name') RF.name = e.target.value; else if (f === 'rf-min') RF.min = parseInt(e.target.value) || 0; else if (f === 'rf-steps') RF.steps = e.target.value;
    else if (f === 'rf-amt') { RF.ing[e.target.dataset.id] = parseFloat(e.target.value) || 0; refreshNut(); }
    else if (f.startsWith('ro-') && RF.own) RF.own[f.slice(3)] = e.target.value;
  });
  ET.onChange(e => { if (RF && e.target.dataset.f && e.target.dataset.f.startsWith('ro-') && RF.own) RF.own[e.target.dataset.f.slice(3)] = e.target.value; });
  A.rfTool = t => { const k = t.dataset.k, a = RF.tools; a.includes(k) ? a.splice(a.indexOf(k), 1) : a.push(k); ET.sheet.refresh(); };
  A.rfAl = t => { const k = t.dataset.k, a = RF.allergens; a.includes(k) ? a.splice(a.indexOf(k), 1) : a.push(k); ET.sheet.refresh(); };
  A.rfAdd = t => { const id = t.dataset.id; if (!(id in RF.ing)) RF.ing[id] = defaultAmt(id); RF.q = ''; ET.sheet.refresh(); };
  A.rfDel = t => { delete RF.ing[t.dataset.id]; ET.sheet.refresh(); };
  A.rfOwn = () => { RF.own = RF.own ? null : { name: RF.q || '', unit: 'g', pack: 500, price: 1, shelf: 14, storage: 'vorrat', kcal: '', p: '', c: '', f: '', fi: '' }; ET.sheet.refresh(); };
  A.rfCreate = () => {
    const o = RF.own, name = (o.name || '').trim(); if (!name) return alert('Bitte einen Namen eingeben.');
    const num = v => (v === '' || v == null ? null : parseFloat(v)), vals = [o.kcal, o.p, o.c, o.f, o.fi].map(num);
    const n = vals[0] == null ? null : vals.map(v => v || 0);
    const id = ET.uid('x');
    S.customItems.push({ id, name, unit: o.unit, pack: parseFloat(o.pack) || 1, price: parseFloat(o.price) || 0, n, shelf: parseInt(o.shelf) || 7, storage: o.storage, cat: o.storage === 'gefrier' ? 'Tiefkühl' : o.storage === 'kuehl' ? 'Kühlregal' : 'Vorrat' });
    RF.ing[id] = defaultAmt(id); RF.own = null; RF.q = ''; ET.save(); ET.sheet.refresh();
  };
  A.rfSave = () => {
    const name = RF.name.trim(); if (!name) return alert('Bitte einen Namen eingeben.');
    const ing = {}; Object.entries(RF.ing).forEach(([k, v]) => { if (v > 0) ing[k] = v; });
    if (!Object.keys(ing).length) return alert('Bitte mindestens eine Zutat mit Menge hinzufügen.');
    const r = { id: RF.id || ET.uid('u'), name, min: RF.min || 20, steps: RF.steps.trim(), ing, tools: RF.tools.length ? RF.tools : ['herd'], allergens: RF.allergens.slice(), tags: RF.tags.slice(), group: RF.type === 'snack' ? 'snack' : 'eigen', custom: true };
    if (RF.type === 'snack') { r.type = 'snack'; r.serv = 1; }
    const i = S.customRecipes.findIndex(x => x.id === r.id); if (i >= 0) S.customRecipes[i] = r; else S.customRecipes.push(r);
    ET.save(); ET.sheet.close(); ET.render();
  };

  // ---------- Preise & Katalog ----------
  ET.views['more/prices'] = function () {
    const rows = CATALOG.map(c => {
      const o = S.prices[c.id] || {}, n = c.n;
      return `<tr><td>${esc(c.name)}<div class="muted">${c.cat}${c.est && !o.confirmed ? ' · <span class="warn">geschätzt</span>' : ''}</div>
        <div class="muted">pro ${c.unit === 'Stk' ? 'Stück' : '100 ' + c.unit}: ${n ? Math.round(n[0]) + ' kcal · ' + n[1] + ' g Eiweiß · ' + n[2] + ' g KH · ' + n[3] + ' g Fett' : '–'}</div></td>
        <td class="n"><input type="number" step="0.01" min="0" data-pf="price" data-id="${c.id}" value="${(o.price || c.price).toFixed(2)}"></td>
        <td class="n"><input type="number" step="0.01" min="0" placeholder="Angebot" data-pf="offer" data-id="${c.id}" value="${o.offer || ''}"></td></tr>`;
    }).join('');
    const own = S.customItems.length ? '<h2>Eigene Artikel</h2><div class="card"><table>' + S.customItems.map(c => `<tr><td>${esc(c.name)}<div class="muted">${c.pack} ${c.unit}</div></td><td class="n"><input type="number" step="0.01" min="0" data-pf="cprice" data-id="${c.id}" value="${(c.price || 0).toFixed(2)}"></td></tr>`).join('') + '</table></div>' : '';
    return { title: 'Preise & Katalog', html: `<p class="muted">Normalpreis und (optional) Wochenangebot je Packung. Nährwerte sind Richtwerte.</p><div class="card"><table><tr><th>Artikel</th><th>Preis €</th><th>Angebot €</th></tr>${rows}</table></div>${own}<button data-act="clearOffers">Alle Angebote löschen (neue Woche)</button>` };
  };
  A.clearOffers = () => { Object.values(S.prices).forEach(p => delete p.offer); ET.save(); ET.render(); };
  ET.onChange(e => {
    const f = e.target.dataset.pf; if (!f) return;
    const id = e.target.dataset.id, v = parseFloat(e.target.value);
    if (f === 'cprice') { const c = S.customItems.find(x => x.id === id); if (c) c.price = v > 0 ? v : 0; }
    else { const o = S.prices[id] = S.prices[id] || {}; if (f === 'offer') { if (v > 0) o.offer = v; else delete o.offer; } else if (v > 0) { o.price = v; o.confirmed = true; } }
    ET.save();
  });

  // ---------- Tracker ----------
  ET.views['more/tracker'] = function () {
    const hist = S.history, total = hist.reduce((s, h) => s + h.total, 0), n = hist.length, waste = S.waste.reduce((s, w) => s + w.value, 0);
    const logs = Object.entries(S.log).sort((a, b) => a[0].localeCompare(b[0])), nd = logs.length;
    const avgK = nd ? logs.reduce((s, [, l]) => s + l.n[0], 0) / nd : 0, avgP = nd ? logs.reduce((s, [, l]) => s + l.n[1], 0) / nd : 0;
    const eaten = logs.flatMap(([, l]) => l.meals).map(id => ET.rec(id)).filter(Boolean), avgC = eaten.length ? eaten.reduce((s, r) => s + ET.recipeCostPerPortion(r), 0) / eaten.length : 0;
    const budget = S.settings.budget, maxH = Math.max(budget || 0, ...hist.map(h => h.total), 1);
    const byReason = {}; S.waste.forEach(w => { const k = w.reason || 'ohne Angabe'; byReason[k] = (byReason[k] || 0) + w.value; });
    const sorted = ET.allRecipes().filter(r => r.type !== 'snack').map(r => [r, ET.recipeCostPerPortion(r)]).sort((a, b) => a[1] - b[1]);
    let html = `<div class="tiles"><div class="tile"><h3>Ø pro Woche</h3><b style="font-size:1.3rem">${n ? eur(total / n) : '–'}</b></div>
      <div class="tile"><h3>Ø Eiweiß / Tag</h3><b style="font-size:1.3rem">${nd ? Math.round(avgP) + ' g' : '–'}</b></div><div class="tile"><h3>Weggeworfen</h3><b style="font-size:1.3rem">${eur(waste)}</b></div></div>`;
    html += '<h2>Ausgaben pro Einkauf</h2><div class="card">' + (n ? hist.slice(-8).reverse().map(h => `<div style="margin:6px 0"><div class="row"><span>${h.date}</span><span>${h.items} Artikel · ${eur(h.total)}</span></div><div class="bar ${budget && h.total > budget ? 'over' : ''}"><i style="width:${h.total / maxH * 100}%"></i></div></div>`).join('') + (budget ? `<div class="muted">Wochenbudget ${eur(budget)}</div>` : '') : '<span class="muted">Noch keine Einkäufe verbucht.</span>') + '</div>';
    html += '<h2>Weggeworfenes</h2><div class="card">' + (S.waste.length ? Object.entries(byReason).map(([k, v]) => `<div class="row"><span>${esc(k)}</span><span>${eur(v)}</span></div>`).join('') : '<span class="muted">Nichts weggeworfen. 🌿</span>') + '</div>';
    html += '<h2>Eiweiß pro Tag</h2><div class="card">' + (nd ? logs.slice(-7).reverse().map(([d, l]) => `<div class="row"><span>${d}</span><span>${Math.round(l.n[1])} g</span></div>`).join('') : '<span class="muted">Noch keine abgehakten Mahlzeiten.</span>') + '</div>';
    return { title: 'Tracker', html };
  };

  // ---------- Einstellungen ----------
  ET.views['more/settings'] = function () {
    const st = S.settings, num = v => (v == null ? '' : v);
    const html = `<div class="card"><h3>Tagesziele und Budget</h3>
      <label class="field">Eiweiß pro Tag (g)</label><input data-s="protein" type="number" min="0" value="${num(st.protein)}" placeholder="z. B. 100">
      <label class="field">Kalorien pro Tag (kcal)</label><input data-s="kcal" type="number" min="0" value="${num(st.kcal)}" placeholder="optional">
      <label class="field">Wochenbudget (€)</label><input data-s="budget" type="number" min="0" step="0.5" value="${num(st.budget)}" placeholder="optional"></div>
      <details class="card"><summary style="margin:0">Küche, Verträglichkeit und Erinnerungen</summary><h3 style="margin-top:12px">Küche</h3><div class="chips">${TOOLS.map(([k, l]) => `<label class="badge" style="padding:6px 12px"><input type="checkbox" data-s="tool:${k}" ${st.tools[k] ? 'checked' : ''}> ${l}</label>`).join('')}</div>
      <label class="field">Kochzeit-Limit unter der Woche (Min)</label><input data-s="maxMin" type="number" min="0" value="${num(st.maxMin)}" placeholder="kein Limit">
      <h3 style="margin-top:14px">Verträglichkeit</h3><div class="chips">${ALLERGENS.map(([k, l]) => `<label class="badge" style="padding:6px 12px"><input type="checkbox" data-s="allergen:${k}" ${st.allergens.includes(k) ? 'checked' : ''}> ${l}</label>`).join('')}</div>
      <label class="field">Zutaten, die ich nicht mag (mit Komma trennen)</label><input data-s="dislikes" value="${esc(st.dislikes.join(', '))}" placeholder="z. B. Pilze, Rosinen">
      <h3 style="margin-top:14px">Erinnerungen (Hinweis auf Home)</h3>
      ${[['sun', 'Sonntag: Gerichte wählen'], ['expiring', 'Ablaufende Vorräte']].map(([k, l]) => `<label style="display:block;padding:4px 0"><input type="checkbox" data-s="rem:${k}" ${st.rem[k] ? 'checked' : ''}> ${l}</label>`).join('')}
      <h3 style="margin-top:14px">Darstellung</h3><select data-s="theme"><option value="auto" ${st.theme === 'auto' ? 'selected' : ''}>Wie das System</option><option value="light" ${st.theme === 'light' ? 'selected' : ''}>Hell</option><option value="dark" ${st.theme === 'dark' ? 'selected' : ''}>Dunkel</option></select>
      <button style="margin-top:14px" data-act="setupAgain">Einrichtung erneut starten</button></details>`;
    return { title: 'Einstellungen', html };
  };
  ET.onChange(e => {
    const s = e.target.dataset.s; if (!s) return; const st = S.settings, t = e.target;
    const val = t.type === 'checkbox' ? t.checked : t.type === 'number' ? (t.value === '' ? null : parseFloat(t.value)) : t.value;
    if (s.startsWith('tool:')) st.tools[s.slice(5)] = val;
    else if (s.startsWith('allergen:')) { const k = s.slice(9), a = st.allergens; if (val && !a.includes(k)) a.push(k); if (!val && a.includes(k)) a.splice(a.indexOf(k), 1); }
    else if (s.startsWith('rem:')) st.rem[s.slice(4)] = val;
    else if (s === 'dislikes') st.dislikes = String(val).split(',').map(x => x.trim()).filter(Boolean);
    else st[s] = val;
    ET.save(); if (s === 'theme') ET.applyTheme();
  });
  A.setupAgain = () => ET.openSetup();

  // ---------- Backup ----------
  ET.views['more/backup'] = () => ({ title: 'Backup', html: `<div class="card"><p class="muted" style="margin-top:0">Deine Daten (Plan, Vorrat, Einstellungen, eigene Rezepte) liegen nur auf diesem Gerät. Mit Export/Import kannst du sie sichern oder aufs Handy übertragen.</p>
    <div class="row"><button data-act="bkExport">Exportieren</button><button data-act="bkImport">Importieren</button><button data-act="bkReset">Alles zurücksetzen</button></div>
    <textarea id="bkio" style="margin-top:10px;display:none;min-height:140px"></textarea><div id="bkmsg" class="muted"></div></div>` });
  A.bkExport = () => { const io = document.getElementById('bkio'); io.style.display = 'block'; io.value = JSON.stringify(S); io.select(); document.getElementById('bkmsg').textContent = 'Text kopieren und sicher aufbewahren.'; };
  A.bkImport = () => {
    const io = document.getElementById('bkio');
    if (io.style.display === 'none' || !io.value.trim()) { io.style.display = 'block'; io.value = ''; io.placeholder = 'Exportierten Text hier einfügen, dann nochmal „Importieren“'; return; }
    try { ET.replaceState(JSON.parse(io.value)); ET.applyTheme(); ET.render(); } catch (e) { document.getElementById('bkmsg').textContent = 'Ungültige Daten.'; }
  };
  A.bkReset = () => { if (confirm('Wirklich alle Daten auf diesem Gerät löschen?')) { ET.replaceState({}); ET.applyTheme(); ET.openSetup(); ET.go('home'); } };

  // ---------- Info ----------
  ET.views['more/info'] = function () {
    const nn = Object.values(NUTRI).filter(Array.isArray).length;
    return { title: 'Info & Quellen', html: `<div class="card"><h3>Daten</h3>
      <div class="muted">Katalog (${CATALOG.length} Artikel) und Rezepte (${RECIPES.length}): von Hand gepflegt; Preise teils geschätzt, Nährwerte Richtwerte (Rohgewichte).</div>
      <div class="muted" style="margin-top:6px">Lidl-Produkte: ${PROD.items.length} Stück, Stand ${esc(PROD.fetched)}. Quelle: supermarktcheck.de, zuletzt von Nutzern gemeldete Preise, ohne Gewähr.</div>
      <div class="muted" style="margin-top:6px">Nährwerte: ${nn} Produkte erfasst (Quelle: supermarktcheck.de, je 100 g). Wird wöchentlich ergänzt.</div>
      <div class="muted" style="margin-top:6px">Angebote: Stand ${esc(ET.OFF.fetched)}. Quelle: ${esc(ET.OFF.source)}</div></div>
      <div class="card"><h3>Hinweise</h3><div class="muted">Keine Ernährungs- oder Medizinberatung. Bei Allergien immer die Verpackung prüfen. Bananen halten ca. 6 Tage, Milch ca. 10 Tage. Die App speichert alles nur lokal im Browser.</div></div>` };
  };

  // ---------- Einrichtung ----------
  const SU = { step: 0 };
  ET.openSetup = function () {
    SU.step = 0;
    ET.sheet.open('Einrichtung', setupHtml, () => { if (!S.setupDone) { S.setupDone = true; ET.save(); ET.render(); } });
  };
  function setupHtml() {
    const st = S.settings, num = v => (v == null ? '' : v), steps = 4; let h = `<div class="muted">Schritt ${SU.step + 1} von ${steps}</div>`;
    if (SU.step === 0) h += `<h3 style="margin-top:8px">Willkommen beim Einkaufstracker 🌿</h3><p class="muted">Kurz einrichten, damit Plan und Vorschläge zu dir passen. Alles ist später in den Einstellungen änderbar.</p>
      <label class="field">Eiweiß pro Tag (g)</label><input data-s="protein" type="number" min="0" value="${num(st.protein)}" placeholder="z. B. 100">
      <label class="field">Kalorien pro Tag (kcal), optional</label><input data-s="kcal" type="number" min="0" value="${num(st.kcal)}">
      <label class="field">Wochenbudget (€), optional</label><input data-s="budget" type="number" min="0" step="0.5" value="${num(st.budget)}">`;
    else if (SU.step === 1) h += `<h3 style="margin-top:8px">Was hast du in der Küche?</h3><div class="chips">${TOOLS.map(([k, l]) => `<label class="badge" style="padding:8px 14px"><input type="checkbox" data-s="tool:${k}" ${st.tools[k] ? 'checked' : ''}> ${l}</label>`).join('')}</div>
      <label class="field">Kochzeit-Limit unter der Woche (Min), optional</label><input data-s="maxMin" type="number" min="0" value="${num(st.maxMin)}">`;
    else if (SU.step === 2) h += `<h3 style="margin-top:8px">Verträglichkeit</h3><div class="muted">Die App bleibt vegetarisch. Rezepte mit diesen Zutaten werden markiert und nach unten sortiert.</div><div class="chips">${ALLERGENS.map(([k, l]) => `<label class="badge" style="padding:8px 14px"><input type="checkbox" data-s="allergen:${k}" ${st.allergens.includes(k) ? 'checked' : ''}> ${l}</label>`).join('')}</div>
      <label class="field">Zutaten, die ich nicht mag (mit Komma trennen)</label><input data-s="dislikes" value="${esc(st.dislikes.join(', '))}" placeholder="z. B. Pilze, Rosinen">`;
    else h += `<h3 style="margin-top:8px">Fertig!</h3><p class="muted">Dein Plan startet auf Home. Dort siehst du den nächsten Schritt: Vorrat prüfen, Gerichte wählen, einkaufen.</p>`;
    h += `<div class="row" style="margin-top:18px">${SU.step > 0 ? '<button data-act="suBack">Zurück</button>' : '<button class="ghost" data-act="suSkip">Überspringen</button>'}${SU.step < steps - 1 ? '<button class="primary" data-act="suNext">Weiter</button>' : '<button class="primary" data-act="suSkip">Los geht’s</button>'}</div>`;
    return h;
  }
  A.suNext = () => { SU.step++; ET.sheet.refresh(); };
  A.suBack = () => { SU.step--; ET.sheet.refresh(); };
  A.suSkip = () => { S.setupDone = true; ET.save(); ET.sheet.close(); ET.render(); };
})();
