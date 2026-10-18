// Home: Kacheln (Ring, Heute, Woche, Wochen-Checkliste, Bald ablaufend) und Erinnerungs-Banner.
(function () {
  const ET = window.ET, S = ET.S, esc = ET.esc, eur = ET.eur, U = () => ET.ui;
  const SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
  const fmtDate = d => d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  function ringSvg(done, planned, goalK, goalP) {
    const C = r => 2 * Math.PI * r;
    const frac = (v, g, pl) => { const base = g > 0 ? g : (pl > 0 ? pl : 1); return Math.max(0, Math.min(1, v / base)); };
    const arc = (r, f, cls, op) => f < 0.004 ? '' : `<circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--accent)" stroke-opacity="${op}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${f * C(r)} ${C(r)}" transform="rotate(-90 60 60)"/>`;
    const track = r => `<circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--soft)" stroke-width="9"/>`;
    const fk = frac(done[0], goalK, planned[0]), fkp = frac(planned[0], goalK, planned[0]);
    const fp = frac(done[1], goalP, planned[1]), fpp = frac(planned[1], goalP, planned[1]);
    return `<svg class="ring" viewBox="0 0 120 120" role="img" aria-label="Tagesfortschritt">${track(52)}${arc(52, fkp, 'p', 0.28)}${arc(52, fk, 'd', 1)}
      ${track(38)}${arc(38, fpp, 'p', 0.28)}${arc(38, fp, 'd', 1)}
      <text x="60" y="58" text-anchor="middle" font-size="19" font-weight="700">${Math.round(done[1])}</text>
      <text x="60" y="72" text-anchor="middle" font-size="8.5" opacity=".7">${goalP ? 'von ' + goalP + ' g' : 'g Eiweiß'}</text></svg>`;
  }

  function dayStatus(i) {
    const p = S.plan, d = p.days[i];
    const items = [p.shake[i]]; let planned = 1;
    if (d) {
      ['L', 'D'].forEach(m => { if (ET.recipeAt(i, m)) { planned++; items.push(m === 'L' ? d.eL : d.eD); } });
      if (planned === 1 && i < 4) return 'empty';
    }
    return items.every(Boolean) ? 'full' : 'plan';
  }

  function banners() {
    let h = '';
    const add = (key, cls, text, btn, act, data = '') => { if (!ET.dismissed(key)) h += `<div class="banner ${cls}"><span>${text}</span><span><button class="small" data-act="${act}" ${data}>${btn}</button> <button class="small ghost" data-act="dismissBanner" data-key="${key}" aria-label="Ausblenden">✕</button></span></div>`; };
    const p = S.plan, todayD = ET.today();
    if (ET.planExpired()) add('expired', '', 'Die Woche ist vorbei.', 'Neue Woche', 'newWeek');
    if (S.settings.rem.sun && todayD.getDay() === 0 && (!p || ET.planExpired() || ET.filled() < ET.slotCount())) add('sun', '', 'Sonntag: Wähle die Gerichte für die neue Woche.', 'Zum Plan', 'go', 'data-r="plan"');
    if (S.settings.rem.expiring) {
      const urgent = ET.expiring(1); if (urgent.length) add('expiring', 'warn', `${urgent.length} Vorrat${urgent.length > 1 ? 'sartikel laufen' : 'sartikel läuft'} heute/morgen ab.`, 'Vorrat', 'go', 'data-r="pantry"');
    }
    if (S.settings.rem.offers) {
      if (!ET.offersValid()) add('offers-old', 'warn', `Angebote nicht aktuell${ET.OFF.fetched ? ' (Stand ' + esc(ET.OFF.fetched) + ')' : ''}.`, 'Ansehen', 'seeOffers');
      else if (S.seenOffers !== ET.OFF.fetched && ET.OFF.items.length) add('offers-new', '', `Neue Angebote vom ${esc(ET.OFF.fetched)}.`, 'Ansehen', 'seeOffers');
    }
    return h;
  }

  ET.views.home = function () {
    const p = ET.ensurePlan(), todayD = ET.today();
    let idx = ET.todayIdx(), isToday = idx !== null;
    if (idx === null && !ET.planExpired()) idx = 0;           // Wochenende/vor Montag: nächster Plantag
    const sub = fmtDate(todayD);
    let html = banners();
    html += '<div class="tiles">';

    // Ring
    if (idx !== null) {
      const t = ET.dayTotals(idx), gk = S.settings.kcal || 0, gp = S.settings.protein || 0;
      html += `<div class="tile"><h3>${isToday ? 'Heute' : ET.WEEKDAYS[idx]}</h3>${ringSvg(t.done, t.planned, gk, gp)}
        <div class="muted" style="text-align:center;margin-top:6px">${Math.round(t.done[0])} ${gk ? '/ ' + gk : '/ ' + Math.round(t.planned[0])} kcal</div>
        ${gp || gk ? '' : '<div class="muted" style="text-align:center"><button class="small ghost" data-act="go" data-r="more/settings">Ziele festlegen</button></div>'}</div>`;
    } else html += '<div class="tile"><h3>Heute</h3><div class="muted">Kein Plantag. Neue Woche planen.</div></div>';

    // Heute
    if (idx !== null) {
      const d = p.days[idx], rows = [];
      rows.push(`<div class="mealrow"><span data-act="eatShake" data-i="${idx}">${U().check(p.shake[idx])}</span><span class="t" data-act="eatShake" data-i="${idx}">Shake<small>${Math.round(ET.shakeN()[0])} kcal</small></span></div>`);
      if (idx < 4) ['L', 'D'].forEach(m => {
        const r = ET.recipeAt(idx, m), on = m === 'L' ? d.eL : d.eD, label = m === 'L' ? 'Mittag' : 'Abend';
        rows.push(r ? `<div class="mealrow"><span data-act="eat" data-i="${idx}" data-m="${m}">${U().check(on)}</span><span class="t" data-act="openRecipeAt" data-i="${idx}" data-m="${m}">${esc(r.name)}<small>${label} · ${Math.round(ET.portionN(r)[0])} kcal</small></span></div>`
          : `<div class="mealrow" data-act="go" data-r="plan"><span class="check"></span><span class="t muted">${label}: noch leer<small>im Plan wählen</small></span></div>`);
      });
      else rows.push('<div class="muted" style="padding-top:6px">Danach bei den Eltern.</div>');
      html += `<div class="tile"><h3>${isToday ? 'Heute' : 'Nächster Plantag'} · ${ET.WEEKDAYS[idx]}</h3>${rows.join('')}</div>`;
    } else html += '<div class="tile"><h3>Heute</h3><div class="muted">–</div></div>';

    // Woche
    html += '<div class="tile wide"><h3>Woche</h3><div class="week">' + ET.WEEKDAYS.map((n, i) => {
      const st = dayStatus(i);
      return `<button class="${isToday && i === idx ? 'today' : ''}" data-act="openDay" data-i="${i}">${SHORT[i]}<small><span class="dot ${st === 'full' ? 'full' : st === 'plan' ? 'plan' : ''}"></span></small></button>`;
    }).join('') + '</div></div>';

    // Checkliste
    const list = ET.shoppingFor(ET.entries()), checked = list.filter(x => p.checked[x.id]).length;
    const steps = [
      { done: p.pantryChecked, title: 'Vorrat prüfen', info: ET.expiring(3).length ? `${ET.expiring(3).length} laufen bald ab` : 'nichts läuft ab', btn: ['Vorrat öffnen', 'pantryGo'] },
      { done: ET.filled() >= ET.slotCount(), title: 'Gerichte wählen', info: `${ET.filled()}/${ET.slotCount()} Plätze belegt`, btn: ['Zum Plan', 'go', 'plan'] },
      { done: p.bought, title: 'Einkaufen', info: p.bought ? `eingekauft, ${eur(p.spent || 0)}` : `${list.length} Artikel · ${eur(ET.listCost(list))}${checked ? ' · ' + checked + ' abgehakt' : ''}`, btn: ['Zur Liste', 'go', 'shop'] }
    ];
    const cur = steps.findIndex(s => !s.done);
    const budget = S.settings.budget, used = ET.weekCost(), sav = ET.savings(list);
    html += `<div class="tile wide"><h3>Diese Woche${ET.planExpired() ? '' : ' · ab ' + esc(p.week.split('-').reverse().join('.'))}</h3>` + steps.map((s, i) =>
      `<div class="step ${i === cur ? 'cur' : ''}">${U().check(s.done)}<div style="flex:1"><b>${i + 1}. ${s.title}</b><div class="muted">${s.info}</div></div>${i === cur ? `<button class="small primary" data-act="${s.btn[1]}" ${s.btn[2] ? `data-r="${s.btn[2]}"` : ''}>${s.btn[0]}</button>` : ''}</div>`).join('') +
      (cur === -1 ? '<div class="ok" style="padding-top:8px">Alles erledigt – gute Woche! 🌿</div>' : '') +
      (budget ? `<div style="margin-top:10px">${U().bar(used, budget)}<div class="row muted" style="margin-top:4px"><span>${eur(used)} von ${eur(budget)}</span>${used > budget ? '<span class="bad">über Budget</span>' : `<span>noch ${eur(budget - used)}</span>`}</div></div>` : '') +
      (sav > 0.005 ? `<div class="muted" style="margin-top:4px">Ersparnis durch Angebote: ${eur(sav)}</div>` : '') + '</div>';

    // Bald ablaufend
    const ex = ET.expiring(3).sort((a, b) => a.exp.localeCompare(b.exp)).slice(0, 4), t0 = ET.iso(ET.today());
    html += '<div class="tile wide" data-act="go" data-r="pantry" style="cursor:pointer"><h3>Bald ablaufend</h3>' + (ex.length ? ex.map(x => {
      const days = Math.round((ET.parseIso(x.exp) - ET.today()) / 864e5);
      return `<div class="row nowrap" style="padding:3px 0"><span class="t" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(ET.item(x.id).name)}</span><span class="${days < 0 ? 'bad' : 'warn'}" style="flex:none">${days < 0 ? 'abgelaufen' : days === 0 ? 'heute' : days === 1 ? 'morgen' : 'in ' + days + ' Tagen'}</span></div>`;
    }).join('') : '<div class="ok">Nichts läuft in den nächsten 3 Tagen ab ✓</div>') + '</div>';
    html += '</div>';
    return { title: 'Einkaufstracker', sub, html };
  };

  // ---------- Aktionen ----------
  const A = ET.acts;
  A.eat = t => { const i = +t.dataset.i, m = t.dataset.m, d = S.plan.days[i], on = m === 'L' ? d.eL : d.eD; ET.setEaten(i, m, !on); ET.render(); };
  A.eatShake = t => { const i = +t.dataset.i; ET.setShake(i, !S.plan.shake[i]); ET.render(); };
  A.openDay = t => { ET.selDay = +t.dataset.i; ET.go('plan'); };
  A.pantryGo = () => ET.go('pantry');
  A.newWeek = () => { ET.startNewWeek(); ET.render(); };
  A.dismissBanner = t => { ET.dismiss(t.dataset.key); ET.render(); };
  A.seeOffers = () => { S.seenOffers = ET.OFF.fetched; ET.save(); ET.go('more/offers'); };
})();
