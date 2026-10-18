// Plan: Tagesstreifen, Plätze, Auswahl-Sheet, Rezept-Sheet, Drag & Drop.
(function () {
  const ET = window.ET, S = ET.S, esc = ET.esc, eur = ET.eur, fmtN = ET.fmtN, item = ET.item;
  const SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
  const A = ET.acts;
  ET.selDay = null;
  const slotLabel = (d, k) => (k === 's' ? 'Snack' : d.mode === 'split' ? (k === 'a' ? 'Mittag' : 'Abend') : 'Mittag & Abend');
  const anyTouched = d => d.cA || d.cB || d.eL || d.eD;          // Umschalter/Auto nur ohne gekochte Hauptmahlzeiten
  const anyCookedAll = d => anyTouched(d) || d.cS || d.eS;
  const anyCooked = () => S.plan.days.some(anyCookedAll);

  // ---------- Plan-Ansicht ----------
  ET.views.plan = function () {
    const p = ET.ensurePlan();
    if (ET.selDay == null) ET.selDay = ET.todayIdx() != null ? ET.todayIdx() : 0;
    const sel = ET.selDay, td = ET.todayIdx();
    const cost = ET.weekCost(), budget = S.settings.budget;
    let html = `<div class="strip">${ET.WEEKDAYS.map((n, i) => `<button class="${i === sel ? 'sel' : ''} ${i === td ? 'today' : ''}" data-act="selDay" data-day="${i}" data-i="${i}">${SHORT[i]}<br><span class="dot ${i < 4 && !p.days[i].a ? '' : (i === 4 ? 'full' : 'plan')}" style="${i === sel ? 'background:var(--accent-t);opacity:.7' : ''}"></span></button>`).join('')}</div>`;
    html += `<div class="row" style="margin:6px 0"><span class="muted">Einkauf ≈ <b>${eur(cost)}</b>${budget ? ' von ' + eur(budget) : ''}</span><button class="small" data-act="autoPick">Beste 4 automatisch</button></div>`;
    if (budget) html += ET.ui.bar(cost, budget);
    if (budget && cost > budget) html += `<div class="banner warn" style="margin-top:8px"><span>Der Plan liegt ${eur(cost - budget)} über dem Wochenbudget.</span></div>`;

    const day = p.days[sel], sn = ET.shakeN();
    let dayN = sn.slice();
    if (day) ['L', 'D', 'S'].forEach(m => { const r = ET.recipeAt(sel, m); if (r) dayN = ET.addN(dayN, ET.portionN(r)); });
    html += `<div class="card"><div class="row"><b>${ET.WEEKDAYS[sel]}</b><span class="muted">Tag: ${Math.round(dayN[0])} kcal · ${Math.round(dayN[1])} g Eiweiß</span></div>
      <div class="mealrow" style="cursor:default"><span data-act="eatShake" data-i="${sel}">${ET.ui.check(p.shake[sel])}</span><span class="t">🥤 Frühstück: Shake<small>${fmtN(sn)}</small></span></div>`;
    if (day) {
      const touched = anyTouched(day), split = day.mode === 'split';
      html += `<div class="row" style="margin:8px 0 2px"><span class="muted">${split ? 'Mittag und Abend getrennt' : 'Einmal kochen, mittags mehr, abends dasselbe'}</span>${touched ? '' : `<button class="small" data-act="toggleMode" data-i="${sel}">${split ? 'einmal kochen' : 'getrennt kochen'}</button>`}</div>`;
      html += slotHtml(sel, 'a') + (split ? slotHtml(sel, 'b') : '') + slotHtml(sel, 's');
    } else html += '<div class="muted" style="margin-top:8px">Freitag: nur der Shake, danach bei den Eltern.</div>';
    html += '</div><p class="muted">Tipp: Gericht antippen für Details, gedrückt halten und ziehen zum Verschieben (auch auf einen anderen Tag oben).</p>';
    return { title: 'Plan', sub: 'ab ' + p.week.split('-').reverse().join('.'), html };
  };

  function slotHtml(i, k) {
    const d = S.plan.days[i], id = d[k], flag = ET.FLAG_C[k];
    if (!id) return `<div class="slot empty" data-si="${i}" data-sk="${k}" data-act="choose" data-i="${i}" data-k="${k}">${k === 's' ? '+ Snack hinzufügen (optional)' : '+ ' + slotLabel(d, k) + ': Gericht wählen'}</div>`;
    const r = ET.rec(id), por = k === 's' ? '1 Portion' : d.mode === 'split' ? '1 Portion' : '2 Portionen';
    return `<div class="slot" data-si="${i}" data-sk="${k}" data-act="openSlot" data-i="${i}" data-k="${k}"><span class="grip" aria-hidden="true">⠿</span>
      <div class="t ${d[flag] ? 'done' : ''}"><b>${esc(r.name)}</b><div class="muted">${slotLabel(d, k)} · ${r.min} Min · ${por}${d[flag] ? ' · gekocht' : ''}</div></div></div>`;
  }

  A.selDay = t => { ET.selDay = +t.dataset.day; ET.render(); };
  A.autoPick = () => {
    if (anyCooked()) return alert('Es ist schon gekocht oder gegessen. Bitte erst die Haken zurücknehmen.');
    ET.autoPick(); S.plan.bought = false; ET.save(); ET.render();
  };
  A.toggleMode = t => {
    const d = S.plan.days[+t.dataset.i];
    if (d.mode === 'once') d.mode = 'split';
    else {
      if (d.a && d.b && !confirm('Das Abendgericht wird entfernt. Fortfahren?')) return;
      d.mode = 'once'; if (!d.a) d.a = d.b; d.b = null;
    }
    S.plan.bought = false; ET.save(); ET.render();
  };
  A.openSlot = t => {
    if (Date.now() - (ET.dragEnded || 0) < 400) return;
    ET.openRecipe(S.plan.days[+t.dataset.i][t.dataset.k], { i: +t.dataset.i, k: t.dataset.k });
  };
  A.openRecipeAt = t => {
    const i = +t.dataset.i, m = t.dataset.m, d = S.plan.days[i], k = ET.slotKey(d, m);
    ET.openRecipe(d[k], { i, k });
  };

  // ---------- Auswahl-Sheet ----------
  const CS = { i: 0, k: 'a', q: '', quick: false, easy: false, protein: false, cheap: false, budget: false, all: false };
  A.choose = t => { Object.assign(CS, { i: +t.dataset.i, k: t.dataset.k, q: '', quick: false, easy: false, protein: false, cheap: false, budget: false, all: false }); ET.sheet.open(CS.k === 's' ? 'Snack wählen' : 'Gericht wählen', chooseHtml); };
  A.chip = t => { CS[t.dataset.f] = !CS[t.dataset.f]; ET.sheet.refresh(); };
  function cards() {
    const list = ET.suggestions({ type: CS.k === 's' ? 'snack' : 'meal', q: CS.q, quick: CS.quick, easy: CS.easy, protein: CS.protein, cheap: CS.cheap, budget: CS.budget, showAll: CS.all });
    if (!list.length) return '<div class="muted" style="padding:14px 0">Keine passenden Gerichte. Filter lockern' + (S.settings.maxMin && !CS.all ? ' oder „Zeitlimit ignorieren“ antippen.' : '.') + '</div>';
    return list.map(s => {
      const warn = s.fl.aHit.map(a => '⚠ ' + a).concat(s.fl.dHit.map(d => '⚠ ' + esc(d)));
      return `<div class="card" style="margin:8px 0"><div class="row nowrap"><div style="flex:1;min-width:0"><b>${esc(s.r.name)}</b>${s.r.custom ? ' <span class="badge">eigenes</span>' : ''}
        <div class="muted">${s.r.min} Min${(s.r.tags || []).includes('einfach') ? ' · einfach' : ''}${(s.r.tags || []).includes('dip') ? ' · Dip' : ''}${(s.r.tags || []).includes('eintopf') ? ' · Ein-Topf' : ''}${warn.length ? ' · <span class="warn">' + warn.join(', ') + '</span>' : ''}</div></div>
        <button class="small primary" data-act="pickRecipe" data-id="${s.r.id}">wählen</button></div>
        <details><summary>Details</summary><div class="muted">Pro Portion: ${fmtN(s.n)}</div>
        <div class="muted">≈ ${eur(s.per)} Zusatzkosten je Portion${s.offer ? ' · <b class="ok">' + s.offer + ' Zutat(en) im Angebot</b>' : ''}${s.stock ? ' · ' + s.stock + ' Zutat(en) im Vorrat' : ''}</div>
        <div class="muted">Zutaten (${ET.serv(s.r)} Portion${ET.serv(s.r) > 1 ? 'en' : ''}): ${Object.entries(s.r.ing).map(([id, a]) => esc(item(id).name) + ' ' + Math.round(a * 10) / 10 + ' ' + item(id).unit).join(', ')}</div></details></div>`;
    }).join('');
  }
  function chooseHtml() {
    const d = S.plan.days[CS.i], left = ET.budgetLeft();
    return `<div class="muted">${ET.WEEKDAYS[CS.i]} · ${slotLabel(d, CS.k)}</div>
      <input id="cq" type="search" placeholder="Name oder Zutat suchen" value="${esc(CS.q)}" style="margin:8px 0">
      <div class="chips">${ET.ui.chip('schnell ≤20 Min', CS.quick, 'chip', 'data-f="quick"')}${ET.ui.chip('einfach', CS.easy, 'chip', 'data-f="easy"')}${ET.ui.chip('eiweißreich', CS.protein, 'chip', 'data-f="protein"')}${ET.ui.chip('günstig / Angebot', CS.cheap, 'chip', 'data-f="cheap"')}${left != null ? ET.ui.chip('passt ins Budget', CS.budget, 'chip', 'data-f="budget"') : ''}${S.settings.maxMin ? ET.ui.chip('Zeitlimit ignorieren', CS.all, 'chip', 'data-f="all"') : ''}</div>
      <div id="clist">${cards()}</div>`;
  }
  ET.onInput(e => { if (e.target.id === 'cq') { CS.q = e.target.value; document.getElementById('clist').innerHTML = cards(); } });
  A.pickRecipe = t => {
    const d = S.plan.days[CS.i]; d[CS.k] = t.dataset.id; S.plan.bought = false; ET.save(); ET.sheet.close(); ET.selDay = CS.i; ET.render();
  };

  // ---------- Rezept-Sheet ----------
  ET.openRecipe = function (id, ctx) {
    const r = ET.rec(id); if (!r) return;
    ET.sheet.open(r.name, () => recipeHtml(r, ctx));
    ET._recCtx = ctx || null; ET._recId = id;
  };
  function recipeHtml(r, ctx) {
    const d = ctx ? S.plan.days[ctx.i] : null, f = d && ctx.k !== 's' && d.mode === 'split' ? 0.5 : 1, ni = ET.ingNutri(r.ing), fl = ET.recipeFlags(r);
    const flag = ctx ? ET.FLAG_C[ctx.k] : null, sv = ET.serv(r);
    const tg = (r.tags || []).map(t => ({ einfach: 'einfach', dip: 'Dip', eintopf: 'Ein-Topf' }[t])).filter(Boolean).concat(r.type === 'snack' ? ['Snack'] : []);
    let h = `<div class="muted">${r.min} Min · ${ET.recipeCostPerPortion(r) ? '≈ ' + eur(ET.recipeCostPerPortion(r)) + ' je Portion' : ''}${(r.tools || []).length ? ' · Geräte: ' + r.tools.join(', ') : ''}</div>${tg.length ? '<div class="chips">' + tg.map(t => `<span class="badge">${t}</span>`).join('') + '</div>' : ''}`;
    if (fl.warn) h += `<div class="warn" style="margin:4px 0">⚠ ${fl.aHit.concat(fl.dHit).map(esc).join(', ')}</div>`;
    h += `<div class="card"><h3>Pro Portion</h3><div class="muted">${fmtN(ET.portionN(r))}</div>${ni.unknown.length ? `<div class="warn" style="font-size:.85rem">Nährwerte unvollständig (${ni.unknown.map(i => esc(item(i).name)).join(', ')})</div>` : ''}
      <div class="muted" style="font-size:.82rem">${r.type === 'snack' ? 'Richtwerte.' : 'Inkl. ca. 10 g Öl je Portion, Richtwerte.'}</div></div>`;
    h += `<h3>Zutaten ${d ? (f === 1 ? '(' + sv + ' Portion' + (sv > 1 ? 'en' : '') + ')' : '(1 Portion)') : '(' + sv + ' Portion' + (sv > 1 ? 'en' : '') + ')'}</h3><div class="muted">${Object.entries(r.ing).map(([iid, a]) => `${Math.round(a * f * 10) / 10} ${item(iid).unit} ${esc(item(iid).name)}`).join('<br>')}</div>`;
    h += `<h3 style="margin-top:12px">Zubereitung</h3><p style="margin:0">${esc(r.steps || '–')}</p>`;
    h += '<div class="row" style="margin-top:16px">';
    if (ctx) h += `<button class="primary" data-act="recCook">${d[flag] ? 'Gekocht zurücknehmen' : 'Gekocht ✓'}</button><button data-act="recRemove">Aus Plan entfernen</button>`;
    else h += '<button class="primary" data-act="recToPlan">In den Plan</button>';
    if (r.custom) h += '<button data-act="recEdit">Bearbeiten</button><button data-act="recDelete">Löschen</button>';
    return h + '</div>';
  }
  A.recCook = () => { const c = ET._recCtx, d = S.plan.days[c.i], flag = ET.FLAG_C[c.k]; ET.setCooked(c.i, c.k, !d[flag]); ET.sheet.refresh(); ET.render(); };
  A.recRemove = () => {
    const c = ET._recCtx, d = S.plan.days[c.i];
    if (d[ET.FLAG_C[c.k]]) return alert('Schon gekocht. Bitte erst „Gekocht zurücknehmen“.');
    d[c.k] = null; S.plan.bought = false; ET.save(); ET.sheet.close(); ET.render();
  };
  A.recToPlan = () => {
    ET.ensurePlan();
    const snack = (ET.rec(ET._recId) || {}).type === 'snack';
    for (let i = 0; i < S.plan.days.length; i++) {
      const d = S.plan.days[i], k = snack ? (!d.s ? 's' : null) : !d.a ? 'a' : (d.mode === 'split' && !d.b ? 'b' : null);
      if (k) { d[k] = ET._recId; S.plan.bought = false; ET.save(); ET.sheet.close(); ET.selDay = i; ET.go('plan'); return; }
    }
    alert('Alle Plätze sind belegt. Entferne zuerst ein Gericht im Plan.');
  };

  // ---------- Drag & Drop ----------
  let drag = null;
  const hit = (x, y) => {
    const el = document.elementFromPoint(x, y); if (!el) return null;
    const slot = el.closest('.slot[data-si]'); if (slot) return { type: 'slot', el: slot, i: +slot.dataset.si, k: slot.dataset.sk };
    const day = el.closest('.strip button[data-day]'); if (day && +day.dataset.day < 4) return { type: 'day', el: day, i: +day.dataset.day };
    return null;
  };
  function clearMarks() { document.querySelectorAll('.dropok').forEach(n => n.classList.remove('dropok')); }
  function begin() {
    if (!drag || drag.started) return;
    drag.started = true; drag.el.classList.add('dragsrc');
    const g = document.createElement('div'); g.className = 'ghost-drag'; g.textContent = drag.el.querySelector('b').textContent; document.body.appendChild(g); drag.ghost = g;
    document.body.style.userSelect = 'none';
    if (navigator.vibrate) navigator.vibrate(12);
    place(drag.x, drag.y);
  }
  const place = (x, y) => { if (drag.ghost) { drag.ghost.style.left = (x + 12) + 'px'; drag.ghost.style.top = (y - 20) + 'px'; } };
  function end(cancel) {
    if (!drag) return;
    clearTimeout(drag.timer);
    if (drag.started) {
      const h = !cancel && hit(drag.x, drag.y);
      drag.el.classList.remove('dragsrc'); if (drag.ghost) drag.ghost.remove(); clearMarks();
      document.body.style.userSelect = '';
      ET.dragEnded = Date.now();
      if (h) move({ i: drag.i, k: drag.k }, h);
    }
    drag = null;
  }
  function move(from, to) {
    const days = S.plan.days, d1 = days[from.i];
    let ti = to.i, tk = to.k;
    if (to.type === 'day') { const d = days[ti]; tk = from.k === 's' ? 's' : !d.a ? 'a' : (d.mode === 'split' && !d.b ? 'b' : 'a'); }
    const d2 = days[ti];
    if (!d2 || (from.i === ti && from.k === tk)) return;
    if ((from.k === 's') !== (tk === 's')) return;   // Snacks nur mit Snacks tauschen
    const f1 = ET.FLAG_C[from.k], f2 = ET.FLAG_C[tk], snack = from.k === 's';
    if (d1[f1] || d2[f2] || (snack ? d1.eS || d2.eS : d1.eL || d1.eD || d2.eL || d2.eD)) return alert('Gekochte oder gegessene Gerichte lassen sich nicht verschieben. Bitte erst die Haken zurücknehmen.');
    const tmp = d1[from.k]; d1[from.k] = d2[tk]; d2[tk] = tmp;
    S.plan.bought = false; ET.save(); ET.selDay = ti; ET.render();
  }
  document.addEventListener('pointerdown', e => {
    const s = e.target.closest('.slot[data-si]');
    if (!s || s.classList.contains('empty') || e.button > 0) return;
    drag = { el: s, i: +s.dataset.si, k: s.dataset.sk, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, touch: e.pointerType !== 'mouse', started: false, ghost: null, timer: null };
    if (drag.touch) drag.timer = setTimeout(begin, 380);
  });
  document.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.x = e.clientX; drag.y = e.clientY;
    const dist = Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy);
    if (!drag.started) {
      if (drag.touch) { if (dist > 10) { clearTimeout(drag.timer); drag = null; } }
      else if (dist > 6) begin();
      return;
    }
    place(e.clientX, e.clientY); clearMarks();
    const h = hit(e.clientX, e.clientY); if (h && !(h.type === 'slot' && h.el === drag.el)) h.el.classList.add('dropok');
  });
  document.addEventListener('pointerup', () => end(false));
  document.addEventListener('pointercancel', () => end(true));
  document.addEventListener('touchmove', e => { if (drag && drag.started) e.preventDefault(); }, { passive: false });
  document.addEventListener('contextmenu', e => { if (e.target.closest('.slot[data-si]')) e.preventDefault(); });
})();
