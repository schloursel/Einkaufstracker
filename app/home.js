// Home: Kacheln (Ring, Heute, Woche, Wochen-Checkliste, Bald ablaufend) und Erinnerungs-Banner.
(function () {
  const ET = window.ET, S = ET.S, esc = ET.esc, eur = ET.eur, U = () => ET.ui;
  const SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
  const fmtDate = d => d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  function dayStatus(i) {
    const p = S.plan, d = p.days[i];
    const items = [p.shake[i]]; let planned = 1;
    if (d) {
      ['L', 'D', 'S'].forEach(m => { if (ET.recipeAt(i, m)) { planned++; items.push(d[ET.FLAG_E[m]]); } });
      if (planned === 1 && i < 4) return 'empty';
    }
    return items.every(Boolean) ? 'full' : 'plan';
  }

  function banners() {
    const out = [];
    const add = (key, cls, text, btn, act, data = '') => { if (!ET.dismissed(key)) out.push(`<div class="banner ${cls}"><span>${text}</span><span><button class="small" data-act="${act}" ${data}>${btn}</button> <button class="small ghost" data-act="dismissBanner" data-key="${key}" aria-label="Ausblenden">✕</button></span></div>`); };
    const p = S.plan, todayD = ET.today();
    if (ET.planExpired()) add('expired', '', 'Die Woche ist vorbei.', 'Neue Woche', 'newWeek');
    if (S.settings.rem.sun && todayD.getDay() === 0 && (!p || ET.planExpired() || ET.filled() < ET.slotCount())) add('sun', '', 'Sonntag: Wähle die Gerichte für die neue Woche.', 'Zum Plan', 'go', 'data-r="plan"');
    if (S.settings.rem.expiring) {
      const urgent = ET.expiring(1); if (urgent.length) add('expiring', 'warn', `${urgent.length} Vorrat${urgent.length > 1 ? 'sartikel laufen' : 'sartikel läuft'} heute/morgen ab.`, 'Vorrat', 'go', 'data-r="pantry"');
    }
    return out[0] || '';   // höchstens ein Hinweis, der wichtigste zuerst
  }

  ET.views.home = function () {
    const p = ET.ensurePlan(), todayD = ET.today();
    let idx = ET.todayIdx(), isToday = idx !== null;
    if (idx === null && !ET.planExpired()) idx = 0;           // Wochenende/vor Montag: nächster Plantag
    let html = banners();

    // 1. Als Nächstes: der eine offene Schritt
    const list = ET.shoppingFor(ET.entries()), checked = list.filter(x => p.checked[x.id]).length;
    const steps = [
      { done: p.pantryChecked, title: 'Vorrat prüfen', info: ET.expiring(3).length ? `${ET.expiring(3).length} laufen bald ab` : 'nichts läuft ab', btn: ['Vorrat öffnen', 'pantryGo'] },
      { done: ET.filled() >= ET.slotCount(), title: 'Gerichte wählen', info: `${ET.filled()} von ${ET.slotCount()} Plätzen belegt`, btn: ['Zum Plan', 'go', 'plan'] },
      { done: p.bought, title: 'Einkaufen', info: `${list.length} Artikel · ${eur(ET.listCost(list))}${checked ? ' · ' + checked + ' abgehakt' : ''}`, btn: ['Zur Liste', 'go', 'shop'] }
    ];
    const cur = steps.findIndex(s => !s.done), budget = S.settings.budget, used = ET.weekCost();
    html += cur === -1
      ? `<div class="card"><div class="ok"><b>Alles erledigt – gute Woche! 🌿</b></div>${p.spent ? `<div class="muted">Eingekauft für ${eur(p.spent)}</div>` : ''}</div>`
      : `<div class="card"><div class="muted">Als Nächstes · Schritt ${cur + 1} von ${steps.length}</div><h2 style="margin:2px 0 0">${steps[cur].title}</h2><div class="muted">${steps[cur].info}</div>
          <button class="primary block" style="margin-top:12px" data-act="${steps[cur].btn[1]}" ${steps[cur].btn[2] ? `data-r="${steps[cur].btn[2]}"` : ''}>${steps[cur].btn[0]}</button>
          ${budget && used > budget ? `<div class="bad" style="margin-top:8px">${eur(used - budget)} über dem Wochenbudget</div>` : ''}</div>`;

    // 2. Heute: nur die Mahlzeiten zum Abhaken
    if (idx !== null) {
      const d = p.days[idx], rows = [];
      rows.push(`<div class="mealrow"><span data-act="eatShake" data-i="${idx}">${U().check(p.shake[idx])}</span><span class="t" data-act="eatShake" data-i="${idx}">Shake</span></div>`);
      if (idx < 4) ['L', 'D'].forEach(m => {
        const r = ET.recipeAt(idx, m), on = m === 'L' ? d.eL : d.eD, label = m === 'L' ? 'Mittag' : 'Abend';
        rows.push(r ? `<div class="mealrow"><span data-act="eat" data-i="${idx}" data-m="${m}">${U().check(on)}</span><span class="t" data-act="openRecipeAt" data-i="${idx}" data-m="${m}">${esc(r.name)}<small>${label}</small></span></div>`
          : `<div class="mealrow" data-act="go" data-r="plan"><span class="check"></span><span class="t muted">${label}: noch leer<small>im Plan wählen</small></span></div>`);
      });
      else rows.push('<div class="muted" style="padding-top:6px">Danach bei den Eltern.</div>');
      if (idx < 4 && d.s) { const r = ET.rec(d.s); rows.push(`<div class="mealrow"><span data-act="eat" data-i="${idx}" data-m="S">${U().check(d.eS)}</span><span class="t" data-act="openRecipeAt" data-i="${idx}" data-m="S">${esc(r.name)}<small>Snack</small></span></div>`); }
      const t = ET.dayTotals(idx), gp = S.settings.protein || 0;
      html += `<div class="card"><h3>${isToday ? 'Heute' : 'Nächster Plantag'} · ${ET.WEEKDAYS[idx]}</h3>${rows.join('')}` +
        (gp ? `<div style="margin-top:10px">${U().bar(t.done[1], gp)}<div class="muted" style="margin-top:4px">Eiweiß ${Math.round(t.done[1])} von ${gp} g</div></div>` : '') + '</div>';
    } else html += '<div class="card muted">Kein Plantag. Neue Woche planen.</div>';

    // 3. Woche: kleine Leiste
    html += '<div class="week" style="margin-top:12px">' + ET.WEEKDAYS.map((n, i) => {
      const st = dayStatus(i);
      return `<button class="${isToday && i === idx ? 'today' : ''}" data-act="openDay" data-i="${i}">${SHORT[i]}<small><span class="dot ${st === 'full' ? 'full' : st === 'plan' ? 'plan' : ''}"></span></small></button>`;
    }).join('') + '</div>';
    return { title: 'Einkaufstracker', sub: fmtDate(todayD), html };
  };

  // ---------- Aktionen ----------
  const A = ET.acts;
  A.eat = t => { const i = +t.dataset.i, m = t.dataset.m, d = S.plan.days[i], on = d[ET.FLAG_E[m]]; ET.setEaten(i, m, !on); ET.render(); };
  A.eatShake = t => { const i = +t.dataset.i; ET.setShake(i, !S.plan.shake[i]); ET.render(); };
  A.openDay = t => { ET.selDay = +t.dataset.i; ET.go('plan'); };
  A.pantryGo = () => ET.go('pantry');
  A.newWeek = () => { ET.startNewWeek(); ET.render(); };
  A.dismissBanner = t => { ET.dismiss(t.dataset.key); ET.render(); };
  A.seeOffers = () => { S.seenOffers = ET.OFF.fetched; ET.save(); ET.go('more/offers'); };
})();
