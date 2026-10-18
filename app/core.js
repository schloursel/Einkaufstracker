// Kern: Zustand, Artikel (Katalog / Lidl-Produkte / eigene), Preise, Nährwerte, Rezepte, Plan, Vorrat.
(function () {
  const ET = window.ET = {};
  const KEY = 'et_state_v1';

  // ---------- Helfer ----------
  const eur = n => (Math.round(n * 100) / 100).toFixed(2).replace('.', ',') + ' €';
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const parseIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const normS = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const nextMonday = (from = new Date()) => { const d = new Date(from.getFullYear(), from.getMonth(), from.getDate()); return addDays(d, (8 - d.getDay()) % 7); };
  Object.assign(ET, { eur, iso, parseIso, addDays, today, esc, normS, nextMonday });

  // ---------- Zustand ----------
  const defaults = () => ({
    prices: {}, pantry: {}, plan: null, history: [], waste: [], log: {},
    settings: {
      protein: null, kcal: null, budget: null,
      tools: { herd: true, backofen: true, mikro: true, airfryer: false, mixer: false, reiskocher: false },
      allergens: [], dislikes: [], maxMin: null, theme: 'auto', rem: { sun: true, expiring: true, offers: true }
    },
    setupDone: false, customRecipes: [], customItems: [], minStock: {}, storage: {}, fill: { kuehl: 0, gefrier: 0 },
    dismissed: {}, seenOffers: '', nextId: 1
  });
  function migrate(s) {
    const d = defaults();
    s = Object.assign(d, s || {});
    s.settings = Object.assign(d.settings, (s && s.settings) || {});
    s.settings.tools = Object.assign(defaults().settings.tools, s.settings.tools || {});
    s.settings.rem = Object.assign(defaults().settings.rem, s.settings.rem || {});
    s.fill = Object.assign({ kuehl: 0, gefrier: 0 }, s.fill || {});
    if (s.plan && !s.plan.days) s.plan = null;
    if (s.plan) {
      s.plan.days.forEach(day => { day.eL = !!day.eL; day.eD = !!day.eD; });
      s.plan.checked = s.plan.checked || {};
      s.plan.pantryChecked = !!s.plan.pantryChecked;
    }
    // alte eigene Vorratsartikel (Schlüssel "x:<name>") in eigene Artikel umwandeln
    for (const k of Object.keys(s.pantry)) {
      const p = s.pantry[k];
      if (p && p.custom) {
        const id = 'x' + (s.nextId++);
        s.customItems.push({ id, name: p.name, unit: p.unit || 'g', pack: p.amount || 1, price: 0, n: null, shelf: 7, storage: 'vorrat', cat: 'Vorrat' });
        s.pantry[id] = { amount: p.amount, exp: p.exp };
        delete s.pantry[k];
      }
    }
    return s;
  }
  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    return migrate(s);
  }
  ET.S = load();
  const S = ET.S;
  ET.save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  ET.replaceState = obj => { const n = migrate(obj); Object.keys(S).forEach(k => delete S[k]); Object.assign(S, n); ET.save(); };
  ET.uid = prefix => { const id = prefix + (S.nextId++); ET.save(); return id; };

  // ---------- Artikel ----------
  const PROD = window.PRODUCTS || { items: [], fetched: '', source: '' };
  const NUTRI = window.NUTRI || {};
  const PIDX = new Map(PROD.items.map(r => [String(r[0]), r]));
  const PCAT = {
    'Molkereiprodukte und Ersatz': ['Kühlregal', 'kuehl', 10], 'Frische Lebensmittel aus der Kühlung': ['Kühlregal', 'kuehl', 7],
    'Tiefkühlkost': ['Tiefkühl', 'gefrier', 180], 'Backwaren': ['Brot', 'vorrat', 7], 'Fleisch Wurst und Ersatz': ['Kühlregal', 'kuehl', 7],
    'Süßwaren & Knabberartikel': ['Vorrat', 'vorrat', 180], 'Getränke': ['Vorrat', 'vorrat', 180], 'Müsli, Konfitüre & Kaffee': ['Vorrat', 'vorrat', 270],
    'Saucen, Suppen & Gewürze': ['Vorrat', 'vorrat', 270], 'Konserven': ['Vorrat', 'vorrat', 500], 'Nahrungsmittel': ['Vorrat', 'vorrat', 270]
  };
  function parsePack(s) {
    const m = /([\d.,]+)\s*(Kilogramm|kg|Gramm|g|Liter|l|Milliliter|ml|St(?:ü|u)ck|Stk)\b/i.exec(s || '');
    if (!m) return { unit: 'Stk', pack: 1, unsure: true };
    const v = parseFloat(m[1].replace(',', '.')), u = m[2].toLowerCase();
    if (u === 'kg' || u.startsWith('kilo')) return { unit: 'g', pack: v * 1000 };
    if (u === 'g' || u.startsWith('gramm')) return { unit: 'g', pack: v };
    if (u === 'l' || u === 'liter') return { unit: 'ml', pack: v * 1000 };
    if (u === 'ml' || u.startsWith('milli')) return { unit: 'ml', pack: v };
    return { unit: 'Stk', pack: v || 1 };
  }
  const MISSING = { id: '?', name: '(unbekannt)', cat: 'Vorrat', unit: 'Stk', pack: 1, price: 0, n: null, shelf: 7, storage: 'vorrat', allergens: [] };
  function item(id) {
    if (typeof id === 'string' && id.startsWith('p:')) {
      const r = PIDX.get(id.slice(2)); if (!r) return Object.assign({}, MISSING, { id });
      const pk = parsePack(r[3]), pc = PCAT[r[2]] || ['Vorrat', 'vorrat', 270], nu = NUTRI[r[0]];
      return { id, kind: 'product', name: r[1], cat: pc[0], unit: pk.unit, pack: pk.pack, packUnsure: !!pk.unsure, packText: r[3], price: r[4], shelf: pc[2], storage: pc[1],
        n: pk.unit !== 'Stk' && Array.isArray(nu) ? nu : null, allergens: [], est: false, pcat: r[2] };
    }
    if (typeof id === 'string' && id.startsWith('x')) {
      const c = S.customItems.find(x => x.id === id); return c ? Object.assign({ kind: 'custom', allergens: [] }, c) : Object.assign({}, MISSING, { id });
    }
    const c = CATALOG.find(x => x.id === id);
    return c ? Object.assign({ kind: 'catalog' }, c) : Object.assign({}, MISSING, { id });
  }
  ET.item = item;
  ET.parsePack = parsePack;
  ET.storageOf = id => S.storage[id] || item(id).storage;

  // ---------- Wochenangebote ----------
  const OFF = window.OFFERS || { week: '', items: [], fetched: '', source: '' };
  ET.OFF = OFF;
  const targetWeek = () => (S.plan ? S.plan.week : iso(nextMonday()));
  const offersValid = () => OFF.week === targetWeek();
  ET.offersValid = offersValid;
  ET.targetWeek = targetWeek;
  function autoOffer(id) {
    if (!offersValid()) return 0;
    const m = OFF.items.find(x => x.catalogId === id && x.packPrice > 0);
    return m ? m.packPrice : 0;
  }
  const normalPrice = id => ((S.prices[id] || {}).price) || item(id).price;
  function price(id) { const o = S.prices[id] || {}; return o.offer || autoOffer(id) || normalPrice(id); }
  const isOffer = id => !!((S.prices[id] && S.prices[id].offer) || autoOffer(id));
  Object.assign(ET, { price, normalPrice, isOffer });

  // ---------- Nährwerte ----------
  // [kcal, Eiweiß, Kohlenhydrate, Fett, Ballaststoffe] je 100 g/ml (Stk: je Stück)
  const OIL = [90, 0, 0, 10, 0]; // ca. 10 g Öl je Portion
  function nutOf(id, amount) {
    const c = item(id), f = c.unit === 'Stk' ? amount : amount / 100;
    return c.n ? c.n.map(v => v * f) : null;
  }
  const addN = (a, b) => a.map((v, i) => v + b[i]);
  const scaleN = (a, f) => a.map(v => v * f);
  function ingNutri(ing) {
    let n = [0, 0, 0, 0, 0]; const unknown = [];
    for (const [id, a] of Object.entries(ing)) { const x = nutOf(id, a); if (x) n = addN(n, x); else unknown.push(id); }
    return { n, unknown };
  }
  const portionN = r => addN(scaleN(ingNutri(r.ing).n, 0.5), OIL);
  const shakeN = () => ingNutri(SHAKE.ing).n;
  const fmtN = n => `${Math.round(n[0])} kcal · ${Math.round(n[1])} g Eiweiß · ${Math.round(n[2])} g KH · ${Math.round(n[3])} g Fett${n[4] ? ' · ' + Math.round(n[4]) + ' g Ballast.' : ''}`;
  Object.assign(ET, { nutOf, addN, scaleN, ingNutri, portionN, shakeN, fmtN, OIL });

  // ---------- Rezepte ----------
  ET.allRecipes = () => RECIPES.concat(S.customRecipes);
  ET.rec = id => ET.allRecipes().find(r => r.id === id);
  function recipeFlags(r) {
    const en = S.settings.tools, missing = (r.tools || []).filter(t => t && en[t] === false);
    const al = new Set(r.allergens || []);
    Object.keys(r.ing).forEach(id => (item(id).allergens || []).forEach(a => al.add(a)));
    const aHit = [...al].filter(a => S.settings.allergens.includes(a));
    const names = Object.keys(r.ing).map(id => normS(item(id).name));
    const dHit = S.settings.dislikes.filter(d => d && names.some(n => n.includes(normS(d))));
    return { missing, aHit, dHit, blocked: missing.length > 0, warn: aHit.length + dHit.length > 0 };
  }
  ET.recipeFlags = recipeFlags;
  ET.recipeCostPerPortion = r => Object.entries(r.ing).reduce((s, [id, a]) => s + a / item(id).pack * price(id), 0) / 2;

  // ---------- Plan ----------
  const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag'];   // Kochtage (Mittag + Abend)
  const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  const newDay = () => ({ mode: 'once', a: null, b: null, cA: false, cB: false, eL: false, eD: false });
  ET.DAYS = DAYS; ET.WEEKDAYS = WEEKDAYS;
  function ensurePlan() {
    if (!S.plan) { S.plan = { week: iso(nextMonday()), days: DAYS.map(newDay), shake: [false, false, false, false, false], bought: false, spent: 0, checked: {}, pantryChecked: false }; ET.save(); }
    return S.plan;
  }
  ET.ensurePlan = ensurePlan;
  ET.planMonday = () => (S.plan ? parseIso(S.plan.week) : nextMonday());
  ET.planExpired = () => !!S.plan && today() > addDays(parseIso(S.plan.week), 4);
  ET.todayIdx = () => { if (!S.plan) return null; const d = Math.round((today() - parseIso(S.plan.week)) / 864e5); return d >= 0 && d <= 4 ? d : null; };
  ET.startNewWeek = () => { S.plan = null; ensurePlan(); };

  // Einträge des Plans; ohne all = nur noch nicht gekochte (Basis für die Einkaufsliste)
  const entries = all => (S.plan ? S.plan.days.flatMap(d => d.mode === 'split'
    ? [d.a && (all || !d.cA) && { id: d.a, f: 0.5 }, d.b && (all || !d.cB) && { id: d.b, f: 0.5 }]
    : [d.a && (all || !d.cA) && { id: d.a, f: 1 }]).filter(Boolean) : []);
  const slotCount = () => (S.plan ? S.plan.days.reduce((s, d) => s + (d.mode === 'split' ? 2 : 1), 0) : DAYS.length);
  const filled = () => entries(true).length;
  Object.assign(ET, { entries, slotCount, filled, newDay });

  function need(picks) {
    const n = {};
    picks.forEach(e => { for (const [id, a] of Object.entries(ET.rec(e.id).ing)) n[id] = (n[id] || 0) + a * e.f; });
    const shakesLeft = Math.max(0, SHAKE.days - (S.plan ? S.plan.shake.filter(Boolean).length : 0));
    for (const [id, a] of Object.entries(SHAKE.ing)) n[id] = (n[id] || 0) + a * shakesLeft;
    for (const [id, m] of Object.entries(S.minStock)) if (m > 0) n[id] = (n[id] || 0) + m;
    return n;
  }
  const pantryAmt = id => (S.pantry[id] && S.pantry[id].amount) || 0;
  function shoppingFor(picks) {
    const list = [], nd = need(picks);
    for (const [id, a] of Object.entries(nd)) {
      const c = item(id), missing = a - pantryAmt(id);
      if (missing <= 0) continue;
      const packs = Math.ceil(missing / c.pack - 1e-9);
      list.push({ id, packs, amount: packs * c.pack, need: a, cost: packs * price(id) });
    }
    return list;
  }
  const listCost = l => l.reduce((s, x) => s + x.cost, 0);
  const savings = l => l.reduce((s, x) => s + (isOffer(x.id) ? Math.max(0, normalPrice(x.id) - price(x.id)) * x.packs : 0), 0);
  Object.assign(ET, { need, pantryAmt, shoppingFor, listCost, savings });
  ET.weekCost = () => ((S.plan && S.plan.spent) || 0) + listCost(shoppingFor(entries()));
  ET.budgetLeft = () => (S.settings.budget ? S.settings.budget - ET.weekCost() : null);

  // ---------- Vorschläge ----------
  ET.suggestions = function (opts = {}) {
    const picks = entries(), base = listCost(shoppingFor(picks)), q = normS(opts.q || '');
    const left = ET.budgetLeft();
    let out = ET.allRecipes().filter(r => !picks.some(e => e.id === r.id)).map(r => {
      const marginal = listCost(shoppingFor([...picks, { id: r.id, f: 1 }])) - base, n = portionN(r), ids = Object.keys(r.ing), fl = recipeFlags(r);
      return { r, marginal, n, fl, offer: ids.filter(isOffer).length, stock: ids.filter(id => pantryAmt(id) > 0).length, score: marginal - Math.min(n[1], 40) * 0.08 + (fl.warn ? 100 : 0) };
    }).filter(x => !x.fl.blocked);
    if (S.settings.maxMin && opts.respectTime !== false) out = out.filter(x => x.r.min <= S.settings.maxMin || opts.showAll);
    if (q) out = out.filter(x => normS(x.r.name).includes(q) || Object.keys(x.r.ing).some(id => normS(item(id).name).includes(q)));
    if (opts.quick) out = out.filter(x => x.r.min <= 20);
    if (opts.protein) out = out.filter(x => x.n[1] >= 30);
    if (opts.cheap) out = out.filter(x => x.offer > 0 || x.marginal / 2 <= 1.2);
    if (opts.budget && left != null) out = out.filter(x => x.marginal <= Math.max(0, left));
    return out.sort((a, b) => a.score - b.score);
  };
  ET.autoPick = function () {
    const ids = [], groups = {}, picks = [];
    const saved = S.plan.days.map(d => ({ a: d.a, b: d.b, mode: d.mode }));
    S.plan.days.forEach(d => { d.a = null; d.b = null; d.mode = 'once'; });
    for (let i = 0; i < DAYS.length; i++) {
      const s = ET.suggestions({}).find(x => !groups[x.r.group]);
      if (!s) break;
      S.plan.days[i].a = s.r.id; groups[s.r.group] = 1; ids.push(s.r.id);
    }
    return ids;
  };

  // ---------- Vorrat / Buchungen ----------
  function bookIng(ing, sign) {
    for (const [id, a] of Object.entries(ing)) {
      const p = S.pantry[id] || { amount: 0, exp: iso(addDays(today(), item(id).shelf)) };
      p.amount = Math.max(0, p.amount + sign * a); S.pantry[id] = p;
    }
  }
  ET.bookIng = bookIng;
  ET.addPantry = function (id, amount, exp) {
    const p = S.pantry[id] || { amount: 0 };
    p.amount += amount; p.exp = exp || iso(addDays(today(), item(id).shelf)); S.pantry[id] = p; ET.save();
  };
  ET.discard = function (id, reason) {
    const p = S.pantry[id]; if (!p || !p.amount) return;
    S.waste.push({ date: iso(today()), id, reason: reason || '', value: p.amount / item(id).pack * price(id) });
    p.amount = 0; ET.save();
  };
  ET.expiring = (days = 3) => Object.entries(S.pantry).filter(([, p]) => p.amount > 0 && p.exp && p.exp <= iso(addDays(today(), days))).map(([id, p]) => ({ id, amount: p.amount, exp: p.exp }));

  const slotKey = (d, meal) => (d.mode === 'split' && meal === 'D' ? 'b' : 'a');
  ET.recipeAt = (i, meal) => { const d = S.plan.days[i]; return d && d[slotKey(d, meal)] ? ET.rec(d[slotKey(d, meal)]) : null; };
  function setCooked(i, k, val) {
    const d = S.plan.days[i], flag = k === 'a' ? 'cA' : 'cB';
    if (!d[k] || d[flag] === val) return;
    const r = ET.rec(d[k]), f = d.mode === 'split' ? 0.5 : 1;
    bookIng(Object.fromEntries(Object.entries(r.ing).map(([id, a]) => [id, a * f])), val ? -1 : 1);
    d[flag] = val;
  }
  ET.setCooked = (i, k, val) => { setCooked(i, k, val); ET.save(); };
  function logDay(i) {
    const p = S.plan, d = p.days[i] || newDay(), date = iso(addDays(parseIso(p.week), i));
    let n = [0, 0, 0, 0, 0]; const meals = [];
    if (p.shake[i]) n = addN(n, shakeN());
    [['L', d.eL], ['D', d.eD]].forEach(([m, on]) => { const r = on && ET.recipeAt(i, m); if (r) { n = addN(n, portionN(r)); meals.push(r.id); } });
    if (n[0] > 0) S.log[date] = { n, meals, shake: !!p.shake[i] }; else delete S.log[date];
  }
  ET.setEaten = function (i, meal, val) {
    const d = S.plan.days[i]; if (!d) return;
    const k = slotKey(d, meal), flagE = meal === 'L' ? 'eL' : 'eD';
    if (!d[k]) return;
    d[flagE] = val;
    if (val) setCooked(i, k, true);
    else if (d.mode === 'once') { if (!d.eL && !d.eD) setCooked(i, 'a', false); }
    else setCooked(i, k, false);
    logDay(i); ET.save();
  };
  ET.setShake = function (i, val) {
    if (S.plan.shake[i] === val) return;
    bookIng(SHAKE.ing, val ? -1 : 1); S.plan.shake[i] = val; logDay(i); ET.save();
  };
  ET.dayTotals = function (i) {
    const p = S.plan, d = p.days[i], done = [0, 0, 0, 0, 0]; let planned = shakeN().slice(), got = p.shake[i] ? shakeN().slice() : [0, 0, 0, 0, 0];
    if (d) [['L', d.eL], ['D', d.eD]].forEach(([m, on]) => { const r = ET.recipeAt(i, m); if (r) { const n = portionN(r); planned = addN(planned, n); if (on) got = addN(got, n); } });
    return { planned, done: got };
  };
  ET.markBought = function () {
    const list = shoppingFor(entries()), chosen = Object.keys(S.plan.checked).filter(k => S.plan.checked[k]);
    const toBuy = chosen.length ? list.filter(x => S.plan.checked[x.id]) : list;
    toBuy.forEach(x => {
      const c = item(x.id), p = S.pantry[x.id] || { amount: 0 };
      p.amount += x.amount; p.exp = iso(addDays(today(), c.shelf)); S.pantry[x.id] = p;
    });
    const cost = listCost(toBuy);
    S.plan.spent = (S.plan.spent || 0) + cost;
    S.history.push({ date: iso(today()), total: cost, items: toBuy.length });
    S.plan.bought = toBuy.length >= list.length; S.plan.checked = {}; ET.save();
  };
  ET.dismiss = key => { S.dismissed[key] = iso(today()); ET.save(); };
  ET.dismissed = key => S.dismissed[key] === iso(today());
})();
