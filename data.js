// Katalog: price = Schätzwert in EUR je Packung (est:true = noch nicht gegen lidl.de/Prospekt geprüft)
// unit: g | ml | Stk ; pack = Packungsgröße in unit ; p = Protein in g je 1 unit ; shelf = Haltbarkeit in Tagen ab Kauf
// Basics (Öl, Salz, Gewürze, Shake-Zutaten) sind absichtlich nicht enthalten und werden als vorhanden angenommen.
window.CATALOG = [
  { id: 'eier',      name: 'Eier (10er, Bodenhaltung)', cat: 'Kühlregal', unit: 'Stk', pack: 10,  price: 1.69, p: 6.0,   shelf: 21 },
  { id: 'skyr',      name: 'Milbona Skyr Natur 500 g',   cat: 'Kühlregal', unit: 'g',   pack: 500, price: 1.19, p: 0.11,  shelf: 14 },
  { id: 'quark',     name: 'Milbona Speisequark Magerstufe 500 g', cat: 'Kühlregal', unit: 'g', pack: 500, price: 1.19, p: 0.12, shelf: 14 },
  { id: 'huettenk',  name: 'Körniger Frischkäse (Hüttenkäse) 200 g', cat: 'Kühlregal', unit: 'g', pack: 200, price: 1.19, p: 0.12, shelf: 12 },
  { id: 'feta',      name: 'Feta in Salzlake 200 g (anteilig von 400 g)', cat: 'Kühlregal', unit: 'g', pack: 200, price: 2.40, p: 0.15, shelf: 21, est: true },
  { id: 'mozzarella',name: 'Mozzarella 125 g',           cat: 'Kühlregal', unit: 'g',   pack: 125, price: 0.65, p: 0.18,  shelf: 14, est: true },
  { id: 'halloumi',  name: 'Halloumi 200 g',             cat: 'Kühlregal', unit: 'g',   pack: 200, price: 2.19, p: 0.21,  shelf: 30, est: true },
  { id: 'tofu',      name: 'Bio-Tofu natur 2 × 200 g (Biotrend)', cat: 'Kühlregal', unit: 'g', pack: 400, price: 1.79, p: 0.14, shelf: 14 },
  { id: 'raeuchertofu', name: 'Räuchertofu 200 g',       cat: 'Kühlregal', unit: 'g',   pack: 200, price: 1.39, p: 0.16,  shelf: 14, est: true },
  { id: 'hummus',    name: 'Hummus 200 g',               cat: 'Kühlregal', unit: 'g',   pack: 200, price: 1.19, p: 0.08,  shelf: 10, est: true },
  { id: 'linsen',    name: 'Rote Linsen 500 g',          cat: 'Vorrat',    unit: 'g',   pack: 500, price: 1.49, p: 0.24,  shelf: 365, est: true },
  { id: 'kichererbsen', name: 'Kichererbsen Glas 540 g', cat: 'Vorrat', unit: 'g', pack: 500, price: 0.89, p: 0.07, shelf: 365 },
  { id: 'kidney',    name: 'Kidneybohnen Dose (240 g abgetropft)', cat: 'Vorrat', unit: 'g', pack: 240, price: 0.45, p: 0.07, shelf: 365 },
  { id: 'haferflocken', name: 'Haferflocken 500 g',      cat: 'Vorrat',    unit: 'g',   pack: 500, price: 0.85, p: 0.13,  shelf: 365, est: true },
  { id: 'nudeln',    name: 'Bio-Vollkornnudeln 500 g',   cat: 'Vorrat',    unit: 'g',   pack: 500, price: 0.99, p: 0.12,  shelf: 365 },
  { id: 'reis',      name: 'Langkornreis parboiled 1 kg', cat: 'Vorrat',   unit: 'g',   pack: 1000,price: 1.49, p: 0.07,  shelf: 365 },
  { id: 'couscous',  name: 'Couscous 500 g',             cat: 'Vorrat',    unit: 'g',   pack: 500, price: 1.29, p: 0.13,  shelf: 365, est: true },
  { id: 'passata',   name: 'Passierte Tomaten 500 g',    cat: 'Vorrat',    unit: 'g',   pack: 500, price: 0.79, p: 0.013, shelf: 365, est: true },
  { id: 'dosentom',  name: 'Dosentomaten 400 g',         cat: 'Vorrat',    unit: 'g',   pack: 400, price: 0.59, p: 0.012, shelf: 365, est: true },
  { id: 'kokosmilch',name: 'Kokosmilch 400 ml',          cat: 'Vorrat',    unit: 'ml',  pack: 400, price: 1.29, p: 0.02,  shelf: 365, est: true },
  { id: 'brot',      name: 'Roggenvollkornbrot geschnitten 500 g', cat: 'Brot', unit: 'g', pack: 500, price: 0.59, p: 0.08, shelf: 7 },
  { id: 'wraps',     name: 'Weizen-Wraps (6 Stk)',       cat: 'Brot',      unit: 'Stk', pack: 6,   price: 1.39, p: 3.0,   shelf: 14,  est: true },
  { id: 'kartoffeln',name: 'Kartoffeln 2 kg',            cat: 'Obst & Gemüse', unit: 'g', pack: 2000, price: 2.29, p: 0.02, shelf: 21, est: true },
  { id: 'suesskart', name: 'Süßkartoffeln 1 kg',         cat: 'Obst & Gemüse', unit: 'g', pack: 1000, price: 2.19, p: 0.016, shelf: 14, est: true },
  { id: 'zwiebeln',  name: 'Zwiebeln 1 kg',              cat: 'Obst & Gemüse', unit: 'g', pack: 1000, price: 1.19, p: 0.01, shelf: 30, est: true },
  { id: 'karotten',  name: 'Karotten 1 kg',              cat: 'Obst & Gemüse', unit: 'g', pack: 1000, price: 0.89, p: 0.009, shelf: 21, est: true },
  { id: 'paprika',   name: 'Paprika (Stück)',            cat: 'Obst & Gemüse', unit: 'Stk', pack: 3, price: 1.69, p: 1.5, shelf: 7, est: true },
  { id: 'zucchini',  name: 'Zucchini 500 g',             cat: 'Obst & Gemüse', unit: 'g', pack: 500, price: 1.49, p: 0.012, shelf: 7, est: true },
  { id: 'champignons', name: 'Champignons 400 g',        cat: 'Obst & Gemüse', unit: 'g', pack: 400, price: 1.39, p: 0.03, shelf: 5, est: true },
  { id: 'brokkoli',  name: 'TK-Brokkoli 750 g',          cat: 'Tiefkühl',  unit: 'g',   pack: 750, price: 1.29, p: 0.028, shelf: 180 },
  { id: 'tkspinat',  name: 'TK-Blattspinat 750 g',       cat: 'Tiefkühl',  unit: 'g',   pack: 750, price: 1.99, p: 0.03,  shelf: 180 },
  { id: 'tkgemuese', name: 'TK-Gemüsepfanne 750 g',      cat: 'Tiefkühl',  unit: 'g',   pack: 750, price: 1.39, p: 0.02,  shelf: 180 },
  { id: 'milch',     name: 'Milch 1,5 % (1 l)',          cat: 'Kühlregal', unit: 'ml',  pack: 1000,price: 0.95, p: 0.034, shelf: 10, est: true },
  { id: 'banane',    name: 'Bananen (5 Stück)',          cat: 'Obst & Gemüse', unit: 'Stk', pack: 5, price: 1.15, p: 1.3, shelf: 6, est: true },
  { id: 'honig',     name: 'Honig 500 g',                cat: 'Vorrat',    unit: 'g',   pack: 500, price: 3.49, p: 0.003, shelf: 730, est: true }
];

// Rezepte: ergibt 2 Portionen (Abendessen + Mittag am Folgetag). amount in Einheit des Katalogartikels.
window.RECIPES = [
  { id: 'dal', name: 'Rotes Linsen-Dal mit Reis', min: 25, group: 'linsen',
    ing: { linsen: 160, kokosmilch: 200, dosentom: 200, zwiebeln: 100, reis: 120, tkspinat: 150 },
    steps: 'Zwiebel anbraten, Linsen, Tomaten, Kokosmilch und 300 ml Wasser 15 Min köcheln, Spinat zugeben. Reis separat kochen.' },
  { id: 'tofupfanne', name: 'Tofu-Gemüse-Pfanne mit Reis', min: 20, group: 'tofu',
    ing: { tofu: 400, tkgemuese: 400, reis: 120, zwiebeln: 50 },
    steps: 'Tofu würfeln und knusprig braten, Gemüse dazu, würzen. Reis separat kochen.' },
  { id: 'kichercurry', name: 'Kichererbsen-Curry', min: 25, group: 'bohnen',
    ing: { kichererbsen: 480, kokosmilch: 200, passata: 250, zwiebeln: 100, reis: 120, tkspinat: 150 },
    steps: 'Zwiebel anbraten, Curry, Passata, Kokosmilch, Kichererbsen 10 Min köcheln, Spinat zugeben. Reis separat kochen.' },
  { id: 'shakshuka', name: 'Shakshuka mit Vollkornbrot', min: 20, group: 'ei',
    ing: { eier: 4, dosentom: 400, paprika: 1, zwiebeln: 100, brot: 100 },
    steps: 'Zwiebel und Paprika anbraten, Tomaten einkochen, Mulden formen, Eier darin stocken lassen.' },
  { id: 'linsenbolo', name: 'Nudeln mit Linsen-Bolognese', min: 25, group: 'linsen',
    ing: { nudeln: 200, linsen: 100, passata: 500, zwiebeln: 100, karotten: 100 },
    steps: 'Zwiebel und Karotte anbraten, Linsen, Passata und 200 ml Wasser 15 Min köcheln. Nudeln kochen.' },
  { id: 'fetaofen', name: 'Feta-Ofengemüse mit Couscous', min: 30, group: 'kaese',
    ing: { feta: 200, zucchini: 300, paprika: 1, couscous: 120, zwiebeln: 100 },
    steps: 'Gemüse mit Feta bei 200 °C 20 Min backen, Couscous mit heißem Wasser quellen lassen.' },
  { id: 'spinatomelett', name: 'Spinat-Omelett mit Hüttenkäse & Kartoffeln', min: 30, group: 'ei',
    ing: { eier: 4, huettenk: 200, tkspinat: 150, kartoffeln: 400 },
    steps: 'Kartoffeln kochen, Eier mit Spinat und Hüttenkäse zu Omelett braten.' },
  { id: 'bohnenwraps', name: 'Bohnen-Wraps mit Skyr-Dip', min: 15, group: 'bohnen',
    ing: { kidney: 480, wraps: 4, paprika: 1, skyr: 100, zwiebeln: 50 },
    steps: 'Bohnen mit Paprika und Zwiebel würzen und erhitzen, in Wraps füllen, Skyr als Dip.' },
  { id: 'halloumibowl', name: 'Halloumi-Süßkartoffel-Bowl', min: 30, group: 'kaese',
    ing: { halloumi: 200, suesskart: 400, brokkoli: 250, hummus: 100 },
    steps: 'Süßkartoffel und Brokkoli im Ofen rösten, Halloumi braten, mit Hummus anrichten.' },
  { id: 'champignonpasta', name: 'Champignon-Spinat-Pasta mit Quark', min: 20, group: 'quark',
    ing: { nudeln: 200, champignons: 250, quark: 250, tkspinat: 150, zwiebeln: 50 },
    steps: 'Pilze und Zwiebel anbraten, Spinat dazu, Quark unterrühren, mit Nudeln mischen.' },
  { id: 'kartoffelquark', name: 'Pellkartoffeln mit Kräuterquark & Ei', min: 25, group: 'quark',
    ing: { kartoffeln: 600, quark: 250, eier: 4, tkgemuese: 200 },
    steps: 'Kartoffeln und Eier kochen, Quark mit Kräutern würzen, Gemüse dünsten.' },
  { id: 'reispfanne', name: 'Reispfanne mit Räuchertofu & Ei', min: 20, group: 'tofu',
    ing: { reis: 150, raeuchertofu: 200, eier: 2, tkgemuese: 400 },
    steps: 'Reis (am besten vom Vortag) mit Tofu und Gemüse braten, Eier unterrühren.' },
  { id: 'linsensuppe', name: 'Linsen-Kokos-Suppe mit Brot', min: 25, group: 'linsen',
    ing: { linsen: 120, karotten: 200, kokosmilch: 200, zwiebeln: 100, brot: 100 },
    steps: 'Gemüse anbraten, Linsen und 600 ml Wasser 15 Min kochen, Kokosmilch zugeben, pürieren.' },
  { id: 'ofennudeln', name: 'Mozzarella-Ofennudeln mit Brokkoli', min: 30, group: 'kaese',
    ing: { nudeln: 200, passata: 400, mozzarella: 250, brokkoli: 200 },
    steps: 'Nudeln, Brokkoli und Passata mischen, Mozzarella darüber, 15 Min bei 200 °C überbacken.' },
  { id: 'kichererbsencouscous', name: 'Kichererbsen-Feta-Couscous', min: 15, group: 'bohnen',
    ing: { kichererbsen: 250, feta: 100, couscous: 120, paprika: 1, zucchini: 150 },
    steps: 'Couscous mit heißem Wasser quellen lassen, Zucchini und Paprika anbraten, alles mit Kichererbsen und zerbröseltem Feta mischen.' },
  { id: 'tofucurry', name: 'Tofu-Kokos-Curry mit Reis', min: 25, group: 'tofu',
    ing: { tofu: 400, kokosmilch: 200, tkgemuese: 400, reis: 120, zwiebeln: 50 },
    steps: 'Tofu anbraten, Zwiebel und Gemüse dazu, mit Kokosmilch und Curry 10 Min köcheln. Reis separat kochen.' },
  { id: 'hummuswrap', name: 'Hummus-Feta-Wraps mit Rohkost', min: 10, group: 'kaese',
    ing: { wraps: 4, hummus: 100, paprika: 1, feta: 100, karotten: 100 },
    steps: 'Wraps mit Hummus bestreichen, Paprika und Karotte in Streifen und Feta darauf, einrollen.' },
  { id: 'suesskartlinsen', name: 'Süßkartoffel-Linsen-Eintopf', min: 30, group: 'linsen',
    ing: { linsen: 120, suesskart: 400, kokosmilch: 200, zwiebeln: 100, tkspinat: 150 },
    steps: 'Zwiebel und Süßkartoffelwürfel anbraten, Linsen, Kokosmilch und 500 ml Wasser 20 Min köcheln, Spinat zugeben.' },
  { id: 'ofenkartoffelnbohnen', name: 'Ofenkartoffeln mit Bohnen & Quark', min: 35, group: 'quark',
    ing: { kartoffeln: 600, quark: 250, kidney: 240, zwiebeln: 50 },
    steps: 'Kartoffelspalten bei 200 °C 25 Min backen, Bohnen erhitzen, Quark mit Kräutern würzen und dazu servieren.' },
  { id: 'halloumiwrap', name: 'Halloumi-Wraps mit Skyr-Dip', min: 15, group: 'kaese',
    ing: { halloumi: 200, wraps: 4, paprika: 1, skyr: 100 },
    steps: 'Halloumi und Paprika anbraten, in Wraps füllen, Skyr als Dip.' }
];

// Nährwerte je 100 g/ml (Stk-Artikel: je Stück): [kcal, Eiweiß, Kohlenhydrate, Fett, Ballaststoffe]
// Richtwerte (Durchschnitt, Rohgewicht bei Trockenware), keine Herstellerangaben.
window.NUTR = {
  eier: [80, 7, 0.4, 5.5, 0], skyr: [63, 11, 4, 0.2, 0], quark: [67, 12, 4, 0.3, 0], huettenk: [98, 12, 3, 4.3, 0],
  feta: [260, 15, 1, 21, 0], mozzarella: [240, 18, 1, 18, 0], halloumi: [320, 22, 2, 25, 0], tofu: [130, 14, 1, 7.5, 0.5],
  raeuchertofu: [175, 17, 1.5, 11, 1], hummus: [280, 6.5, 9, 23, 5], linsen: [340, 24, 50, 1.5, 11],
  kichererbsen: [120, 7, 16, 2.5, 5], kidney: [100, 7, 13, 0.5, 6], haferflocken: [370, 13, 59, 7, 10],
  nudeln: [345, 13, 62, 2.5, 8], reis: [350, 7, 78, 0.8, 1], couscous: [360, 13, 73, 1.5, 3], passata: [25, 1.3, 4, 0.2, 1],
  dosentom: [20, 1, 3.5, 0.2, 1], kokosmilch: [180, 1.5, 3, 18, 0], brot: [200, 6.5, 38, 1.2, 8], wraps: [190, 5.5, 33, 4, 2],
  kartoffeln: [70, 2, 15, 0.1, 2], suesskart: [86, 1.6, 20, 0.1, 3], zwiebeln: [40, 1.1, 8, 0.1, 1.7], karotten: [35, 0.9, 7, 0.2, 3],
  paprika: [45, 1.5, 8, 0.4, 3.5], zucchini: [17, 1.2, 2, 0.3, 1], champignons: [22, 2.7, 0.5, 0.3, 1],
  brokkoli: [30, 3, 2.5, 0.4, 3], tkspinat: [22, 2.7, 0.5, 0.5, 2], tkgemuese: [40, 2, 6, 0.5, 3],
  milch: [47, 3.4, 4.9, 1.5, 0], banane: [105, 1.3, 27, 0.4, 3], honig: [305, 0.3, 82, 0, 0]
};

// Täglicher Frühstücks-Shake (Mo-Fr), je Portion. Zimt wird als vorhanden angenommen.
window.SHAKE = { name: 'Quark-Bananen-Shake', days: 5, ing: { quark: 250, milch: 300, banane: 1, honig: 20 } };

// Lagerort (kuehl | gefrier | vorrat) und Unverträglichkeiten je Katalogartikel
(function () {
  const kuehl = 'eier skyr quark huettenk feta mozzarella halloumi tofu raeuchertofu hummus milch paprika zucchini champignons karotten'.split(' ');
  const gefrier = 'brokkoli tkspinat tkgemuese'.split(' ');
  const allergens = {
    laktose: 'skyr quark huettenk feta mozzarella halloumi milch'.split(' '),
    gluten: 'nudeln couscous haferflocken brot wraps'.split(' '),
    soja: 'tofu raeuchertofu'.split(' '),
    nuesse: []
  };
  CATALOG.forEach(c => {
    c.storage = gefrier.includes(c.id) ? 'gefrier' : kuehl.includes(c.id) ? 'kuehl' : 'vorrat';
    c.allergens = Object.keys(allergens).filter(a => allergens[a].includes(c.id));
  });
  // Benötigte Küchengeräte (Herd wird vorausgesetzt)
  const tools = { fetaofen: ['backofen'], halloumibowl: ['backofen'], ofennudeln: ['backofen'], ofenkartoffelnbohnen: ['backofen', 'herd'], linsensuppe: ['herd', 'mixer'], hummuswrap: [] };
  RECIPES.forEach(r => { r.tools = tools[r.id] || ['herd']; });
})();
CATALOG.forEach(c => { c.n = NUTR[c.id]; });
