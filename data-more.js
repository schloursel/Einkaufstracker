// Erweiterung: weitere Katalogartikel und Rezepte (nach data.js laden).
// Katalogartikel: n = Nährwerte je 100 g/ml (Stk: je Stück) [kcal, Eiweiß, KH, Fett, Ballaststoffe]; est = Preis geschätzt.
(function () {
  const I = (id, name, cat, unit, pack, price, shelf, storage, n, allergens, est) =>
    CATALOG.push({ id, name, cat, unit, pack, price, shelf, storage, n, allergens: allergens || [], est: est !== false });
  const OG = 'Obst & Gemüse', KR = 'Kühlregal', VR = 'Vorrat', TK = 'Tiefkühl', BR = 'Brot';

  I('tomaten', 'Tomaten 500 g', OG, 'g', 500, 1.49, 6, 'kuehl', [18, 0.9, 2.6, 0.2, 1.2]);
  I('gurke', 'Salatgurke (Stück)', OG, 'Stk', 1, 0.79, 7, 'kuehl', [53, 2.5, 12.6, 0.4, 1.8]);
  I('salat', 'Römer-/Eisbergsalat (Stück)', OG, 'Stk', 1, 1.19, 5, 'kuehl', [60, 4, 9, 1, 4]);
  I('rucola', 'Rucola 125 g', OG, 'g', 125, 1.29, 4, 'kuehl', [25, 2.6, 2, 0.7, 1.6]);
  I('spinat', 'Babyspinat 200 g', OG, 'g', 200, 1.49, 4, 'kuehl', [23, 2.9, 0.8, 0.4, 2.2]);
  I('aubergine', 'Aubergine (Stück)', OG, 'Stk', 1, 0.99, 7, 'kuehl', [75, 3, 17, 0.6, 9]);
  I('kuerbis', 'Hokkaido-Kürbis ca. 800 g', OG, 'g', 800, 2.29, 21, 'vorrat', [30, 1.1, 5.5, 0.2, 2]);
  I('blumenkohl', 'Blumenkohl (Stück)', OG, 'Stk', 1, 2.99, 6, 'kuehl', [125, 10, 12, 1.5, 12], [], false);
  I('lauch', 'Lauch (Stück)', OG, 'Stk', 1, 0.99, 7, 'kuehl', [60, 3.5, 10, 0.5, 6]);
  I('avocado', 'Avocado (2 Stück)', OG, 'Stk', 2, 1.69, 5, 'vorrat', [190, 2.4, 10, 18, 8]);
  I('aepfel', 'Äpfel 1 kg', OG, 'g', 1000, 1.99, 21, 'vorrat', [52, 0.3, 12, 0.2, 2.4]);
  I('beeren', 'TK-Beerenmischung 500 g', TK, 'g', 500, 2.49, 180, 'gefrier', [45, 1, 8, 0.4, 4]);
  I('erbsen', 'TK-Erbsen 450 g', TK, 'g', 450, 1.19, 180, 'gefrier', [70, 5.5, 9, 0.5, 5]);
  I('edamame', 'TK-Edamame 400 g', TK, 'g', 400, 2.29, 180, 'gefrier', [122, 12, 9, 5, 5], ['soja']);
  I('mais', 'Mais Dose (285 g abgetropft)', VR, 'g', 285, 0.99, 500, 'vorrat', [85, 3, 16, 1.2, 3], [], false);
  I('sbohnen', 'Schwarze Bohnen Dose (240 g abgetropft)', VR, 'g', 240, 0.69, 500, 'vorrat', [90, 6, 14, 0.5, 7]);
  I('wbohnen', 'Weiße Bohnen Dose (240 g abgetropft)', VR, 'g', 240, 0.55, 500, 'vorrat', [95, 7, 13, 0.5, 6]);
  I('linsendose', 'Linsen Dose (250 g abgetropft)', VR, 'g', 250, 0.79, 500, 'vorrat', [95, 7, 15, 0.7, 5]);
  I('erdnussmus', 'Erdnussmus 350 g', VR, 'g', 350, 2.19, 365, 'vorrat', [600, 25, 12, 50, 6], ['nuesse']);
  I('mandeln', 'Mandeln 200 g', VR, 'g', 200, 2.99, 365, 'vorrat', [580, 21, 10, 50, 12], ['nuesse']);
  I('walnuss', 'Walnüsse 200 g', VR, 'g', 200, 2.99, 365, 'vorrat', [650, 15, 7, 65, 7], ['nuesse']);
  I('cashew', 'Cashews 200 g', VR, 'g', 200, 2.79, 365, 'vorrat', [570, 18, 28, 45, 3], ['nuesse']);
  I('kuerbiskerne', 'Kürbiskerne 200 g', VR, 'g', 200, 2.19, 365, 'vorrat', [560, 30, 5, 46, 6]);
  I('datteln', 'Datteln 250 g', VR, 'g', 250, 1.99, 365, 'vorrat', [280, 2, 65, 0.4, 8]);
  I('schoko', 'Zartbitterschokolade 100 g', VR, 'g', 100, 0.99, 365, 'vorrat', [560, 8, 35, 42, 11], ['laktose']);
  I('popcorn', 'Popcornmais 500 g', VR, 'g', 500, 1.29, 365, 'vorrat', [370, 12, 70, 4, 14]);
  I('reiswaffeln', 'Reiswaffeln 100 g', VR, 'g', 100, 0.89, 180, 'vorrat', [380, 8, 80, 3, 2]);
  I('tortillachips', 'Tortilla-Chips 200 g', VR, 'g', 200, 1.29, 180, 'vorrat', [490, 7, 60, 25, 5]);
  I('knaecke', 'Knäckebrot Roggen 250 g', BR, 'g', 250, 0.99, 180, 'vorrat', [330, 10, 60, 1.5, 15], ['gluten']);
  I('pita', 'Pita-Brot (4 Stück)', BR, 'Stk', 4, 1.19, 7, 'vorrat', [160, 5, 32, 1, 2], ['gluten']);
  I('gnocchi', 'Gnocchi 500 g', KR, 'g', 500, 1.49, 21, 'kuehl', [150, 4, 33, 0.5, 2], ['gluten']);
  I('tortelloni', 'Tortelloni Käse-Spinat 250 g', KR, 'g', 250, 1.99, 14, 'kuehl', [270, 11, 40, 7, 2], ['gluten', 'laktose']);
  I('reisnudeln', 'Reisnudeln 250 g', VR, 'g', 250, 1.39, 365, 'vorrat', [360, 6, 80, 0.6, 1]);
  I('bulgur', 'Bulgur 500 g', VR, 'g', 500, 1.29, 365, 'vorrat', [340, 12, 64, 1.5, 12], ['gluten']);
  I('quinoa', 'Quinoa 500 g', VR, 'g', 500, 3.49, 365, 'vorrat', [370, 14, 64, 6, 7]);
  I('mehl', 'Weizenmehl 1 kg', VR, 'g', 1000, 0.89, 365, 'vorrat', [350, 10, 72, 1, 3], ['gluten']);
  I('tomatenmark', 'Tomatenmark 200 g', VR, 'g', 200, 0.89, 60, 'vorrat', [80, 4, 13, 0.5, 4]);
  I('pesto', 'Pesto Basilikum 190 g', VR, 'g', 190, 1.49, 30, 'vorrat', [450, 5, 5, 45, 2], ['nuesse', 'laktose']);
  I('currypaste', 'Currypaste 120 g', VR, 'g', 120, 1.39, 60, 'vorrat', [100, 2, 12, 5, 3]);
  I('sojasauce', 'Sojasoße 250 ml', VR, 'ml', 250, 1.29, 365, 'vorrat', [60, 6, 8, 0, 0], ['soja', 'gluten']);
  I('tzatziki', 'Tzatziki 250 g', KR, 'g', 250, 1.19, 10, 'kuehl', [110, 3, 4, 9, 0.3], ['laktose']);
  I('joghurt', 'Naturjoghurt 500 g', KR, 'g', 500, 0.79, 14, 'kuehl', [62, 3.5, 4.7, 3.5, 0], ['laktose'], false);
  I('frischkaese', 'Frischkäse natur 200 g', KR, 'g', 200, 0.99, 21, 'kuehl', [250, 6, 3, 23, 0], ['laktose']);
  I('parmesan', 'Hartkäse gerieben 150 g', KR, 'g', 150, 1.73, 30, 'kuehl', [390, 33, 0, 28, 0], ['laktose'], false);
  I('gouda', 'Gouda in Scheiben 200 g', KR, 'g', 200, 1.49, 21, 'kuehl', [350, 25, 0, 28, 0], ['laktose']);
  I('ricotta', 'Ricotta 250 g', KR, 'g', 250, 1.29, 10, 'kuehl', [150, 8, 3, 11, 0], ['laktose']);
  I('falafel', 'Falafel 230 g', KR, 'g', 230, 1.99, 14, 'kuehl', [290, 12, 25, 16, 6]);

  // Rezepte: ing = Mengen für 2 Portionen (Snacks: 1 Portion, serv: 1). tags: einfach, dip, eintopf
  const R = (id, name, min, group, tags, ing, steps, o) => RECIPES.push(Object.assign({ id, name, min, group, tags, ing, steps, tools: ['herd'] }, o || {}));
  const OVEN = { tools: ['backofen', 'herd'] }, OVENONLY = { tools: ['backofen'] }, NONE = { tools: [] };
  const E = ['einfach'], D = ['einfach', 'dip'], T = ['eintopf'];

  // --- Nudeln & Gnocchi ---
  R('pestonudeln', 'Pesto-Nudeln mit Mozzarella & Tomaten', 10, 'pasta', E, { nudeln: 200, pesto: 60, tomaten: 250, mozzarella: 125 }, 'Nudeln kochen, mit Pesto, gewürfelten Tomaten und Mozzarella mischen.');
  R('ricottanudeln', 'Tomaten-Ricotta-Nudeln mit Spinat', 15, 'pasta', E, { nudeln: 200, passata: 300, ricotta: 250, tkspinat: 100 }, 'Passata mit Spinat erhitzen, Ricotta unterrühren, mit den Nudeln mischen.');
  R('erdnussnudeln', 'Erdnuss-Nudeln mit Edamame', 15, 'pasta', E, { nudeln: 200, erdnussmus: 40, sojasauce: 30, edamame: 200, karotten: 100 }, 'Nudeln kochen. Erdnussmus mit Sojasoße und etwas Nudelwasser glatt rühren, mit Edamame und Karottenstreifen vermengen.');
  R('gnocchispinat', 'Gnocchi-Pfanne mit Spinat & Feta', 15, 'pasta', E, { gnocchi: 500, tkspinat: 150, feta: 100, tomaten: 200 }, 'Gnocchi knusprig anbraten, Spinat und Tomaten dazu, Feta darüberbröseln.');
  R('gnocchibohnen', 'Gnocchi in Tomatensoße mit weißen Bohnen', 15, 'pasta', E, { gnocchi: 500, passata: 300, wbohnen: 240, parmesan: 20 }, 'Passata mit Bohnen erhitzen, Gnocchi darin gar ziehen lassen, Parmesan darüber.');
  R('tortelloni', 'Tortelloni mit Pesto-Gemüse', 15, 'pasta', E, { tortelloni: 500, pesto: 40, zucchini: 200, erbsen: 100 }, 'Tortelloni kochen. Zucchini und Erbsen anbraten, Pesto zugeben, alles mischen.');
  R('huettenkaesenudeln', 'Hüttenkäse-Nudeln mit Spinat', 10, 'pasta', E, { nudeln: 200, huettenk: 400, tkspinat: 150 }, 'Nudeln kochen, Spinat auftauen und mit Hüttenkäse unterheben, pfeffern.');
  R('macncheese', 'Mac & Cheese mit Erbsen', 20, 'pasta', E, { nudeln: 200, gouda: 150, milch: 200, erbsen: 100, mehl: 20 }, 'Nudeln kochen. Mehl in Milch aufkochen, Käse schmelzen, Erbsen und Nudeln unterheben.');
  R('nudelkicher', 'Spaghetti mit Kichererbsen & Tomate', 20, 'pasta', E, { nudeln: 200, kichererbsen: 250, passata: 300, parmesan: 20 }, 'Kichererbsen in Passata köcheln, Nudeln dazugeben, Parmesan darüber.');
  R('griechnudelsalat', 'Griechischer Nudelsalat', 15, 'pasta', E, { nudeln: 200, feta: 100, gurke: 1, tomaten: 250, kichererbsen: 250 }, 'Nudeln kochen und abkühlen, mit gewürfeltem Gemüse, Feta und Kichererbsen mischen.', NONE);

  // --- Suppen & Eintöpfe ---
  R('linsenmoehren', 'Linsen-Möhren-Eintopf', 30, 'suppe', T, { linsen: 150, karotten: 300, kartoffeln: 300, zwiebeln: 100 }, 'Alles klein schneiden, mit 1 l Wasser 20 Min köcheln, würzen.');
  R('kartoffellauch', 'Kartoffel-Lauch-Suppe mit weißen Bohnen', 30, 'suppe', T, { kartoffeln: 500, lauch: 1, wbohnen: 480, frischkaese: 100, zwiebeln: 50 }, 'Gemüse in 800 ml Wasser garen, Bohnen und Frischkäse zugeben, grob pürieren.');
  R('tomatenbohnen', 'Tomaten-Bohnen-Suppe mit Nudeln', 20, 'suppe', T, { passata: 500, wbohnen: 240, zwiebeln: 100, nudeln: 80, parmesan: 20 }, 'Zwiebel anbraten, Passata, Bohnen und 300 ml Wasser aufkochen, Nudeln darin garen.');
  R('kuerbissuppe', 'Kürbis-Kokos-Suppe mit Kichererbsen', 30, 'suppe', T, { kuerbis: 600, kokosmilch: 200, kichererbsen: 500, kuerbiskerne: 40, zwiebeln: 100 }, 'Kürbis und Zwiebel anbraten, mit 400 ml Wasser garen, Kokosmilch zugeben und pürieren. Kichererbsen als Einlage, Kürbiskerne darüber.');
  R('chilisincarne', 'Chili sin Carne', 30, 'bohnen', T, { kidney: 240, sbohnen: 240, mais: 285, dosentom: 400, paprika: 1, zwiebeln: 100, reis: 100 }, 'Zwiebel und Paprika anbraten, Bohnen, Mais und Tomaten 15 Min köcheln. Reis separat kochen.');
  R('erbsensuppe', 'Erbsen-Feta-Suppe', 20, 'suppe', T, { erbsen: 400, kartoffeln: 200, zwiebeln: 100, feta: 100 }, 'Kartoffelwürfel und Zwiebel in 500 ml Wasser garen, Erbsen zugeben, pürieren, Feta darüber.');

  // --- Wraps, Bowls & Orientalisches ---
  R('quesadilla', 'Bohnen-Käse-Quesadilla', 15, 'wrap', E, { wraps: 4, sbohnen: 240, gouda: 100, paprika: 1, mais: 100 }, 'Bohnen mit Paprika und Mais auf den Wraps verteilen, Käse darüber, zusammenklappen und beidseitig braten.');
  R('burritobowl', 'Burrito-Bowl mit Avocado', 20, 'bowl', E, { reis: 120, sbohnen: 240, mais: 150, avocado: 1, tomaten: 200, skyr: 100 }, 'Reis kochen, mit Bohnen, Mais, Tomaten und Avocado belegen, Skyr als Sauce.', NONE);
  R('tofufajita', 'Tofu-Fajitas mit Avocado', 20, 'wrap', E, { tofu: 400, wraps: 4, paprika: 2, zwiebeln: 100, avocado: 1 }, 'Tofu, Paprika und Zwiebel scharf anbraten, in Wraps mit Avocado füllen.');
  R('falafelbowl', 'Falafel-Bowl mit Hummus', 20, 'bowl', E, { falafel: 230, couscous: 100, hummus: 100, gurke: 1, tomaten: 200, joghurt: 100 }, 'Falafel kurz anbraten, Couscous quellen lassen, mit Gemüse, Hummus und Joghurt anrichten.');
  R('falafelpita', 'Falafel in Pita mit Tzatziki', 15, 'wrap', E, { falafel: 230, pita: 4, tzatziki: 125, tomaten: 150, gurke: 1 }, 'Falafel erwärmen, Pita aufschneiden und mit Falafel, Gemüse und Tzatziki füllen.');
  R('kichererbsenspinat', 'Kichererbsen-Spinat-Pfanne mit Joghurt', 20, 'bohnen', E, { kichererbsen: 480, spinat: 200, tomatenmark: 20, zwiebeln: 100, joghurt: 100, reis: 100 }, 'Zwiebel und Tomatenmark anbraten, Kichererbsen und Spinat zugeben, Joghurt darauf. Reis separat kochen.');
  R('couscoussalat', 'Couscous-Salat mit Mais & schwarzen Bohnen', 15, 'bohnen', E, { couscous: 120, sbohnen: 240, mais: 150, paprika: 1, tomaten: 150, feta: 100 }, 'Couscous mit heißem Wasser quellen lassen, mit allen Zutaten mischen, Feta darüberbröseln.', NONE);

  // --- Asiatisch ---
  R('currynudeln', 'Curry-Reisnudeln mit Tofu', 20, 'tofu', [], { reisnudeln: 200, tofu: 400, currypaste: 30, kokosmilch: 200, tkgemuese: 300 }, 'Tofu anbraten, Currypaste, Kokosmilch und Gemüse zugeben, mit gekochten Reisnudeln mischen.');
  R('wokei', 'Wok-Nudeln mit Gemüse & Ei', 15, 'ei', E, { reisnudeln: 200, eier: 4, tkgemuese: 400, sojasauce: 30 }, 'Gemüse anbraten, Eier hineinrühren, gekochte Nudeln und Sojasoße unterheben.');
  R('gebratenerreis', 'Gebratener Reis mit Ei & Erbsen', 15, 'reis', E, { reis: 160, eier: 4, erbsen: 150, karotten: 100, sojasauce: 30 }, 'Reis (ideal vom Vortag) mit Gemüse braten, Eier unterrühren, mit Sojasoße abschmecken.');
  R('tofuerdnuss', 'Tofu in Erdnusssoße mit Reis & Brokkoli', 25, 'tofu', [], { tofu: 400, erdnussmus: 40, sojasauce: 30, reis: 140, brokkoli: 300 }, 'Tofu knusprig braten, Brokkoli garen, Erdnussmus mit Sojasoße und Wasser zur Soße verrühren, mit Reis servieren.');
  R('edamamebowl', 'Edamame-Reis-Bowl', 15, 'bowl', E, { reis: 140, edamame: 250, gurke: 1, karotten: 100, sojasauce: 30, avocado: 1 }, 'Reis und Edamame garen, mit Gurke, Karotte und Avocado anrichten, Sojasoße darüber.', NONE);
  R('reisnudelsalat', 'Reisnudel-Salat mit Tofu & Erdnuss-Dressing', 20, 'tofu', [], { reisnudeln: 200, tofu: 400, gurke: 1, karotten: 150, erdnussmus: 30, sojasauce: 30 }, 'Tofu braten, Nudeln kochen und abkühlen, mit Gemüse und dem Dressing aus Erdnussmus und Sojasoße mischen.');

  // --- Eier & Pfanne ---
  R('gemueseomelett', 'Gemüse-Omelett mit Feta', 15, 'ei', E, { eier: 6, tkgemuese: 300, feta: 50 }, 'Gemüse anbraten, verquirlte Eier darübergeben, stocken lassen, Feta darüber.');
  R('ruehreibrot', 'Rührei mit Spinat auf Brot', 10, 'ei', E, { eier: 5, spinat: 150, brot: 150 }, 'Spinat kurz anbraten, Eier hineinrühren, auf Brot servieren.');
  R('avocadobrot', 'Avocado-Ei-Brot', 10, 'ei', E, { brot: 200, avocado: 2, eier: 4, tomaten: 150 }, 'Eier kochen oder braten, Avocado auf das Brot streichen, Ei und Tomate darauf.', NONE);
  R('quarkpfannkuchen', 'Quark-Pfannkuchen mit Beeren', 25, 'quark', [], { mehl: 120, eier: 3, milch: 250, quark: 250, beeren: 200, honig: 20 }, 'Aus Mehl, Eiern und Milch Teig rühren, Pfannkuchen backen, mit Quark, aufgetauten Beeren und Honig füllen.');
  R('tofuscramble', 'Tofu-Rührei mit Spinat', 15, 'tofu', E, { tofu: 400, spinat: 150, tomaten: 150, brot: 150 }, 'Tofu zerbröseln und anbraten, Spinat und Tomaten dazu, mit Brot servieren.');
  R('bratkartoffelei', 'Bratkartoffeln mit Spiegelei & Spinat', 30, 'kartoffel', [], { kartoffeln: 600, eier: 4, tkspinat: 150, zwiebeln: 100 }, 'Kartoffelscheiben mit Zwiebel braten, Spinat zugeben, Spiegeleier darauf.');

  // --- Ofen ---
  R('ofengemuesehummus', 'Ofengemüse mit Hummus & Pita', 35, 'ofen', D, { zucchini: 300, paprika: 2, hummus: 150, pita: 4, feta: 100 }, 'Gemüse bei 200 °C 25 Min rösten, mit Hummus, Feta und aufgebackenem Pita servieren.', OVENONLY);
  R('auberginenmozzarella', 'Überbackene Aubergine mit Mozzarella', 40, 'ofen', [], { aubergine: 2, passata: 300, mozzarella: 250, parmesan: 20, couscous: 100 }, 'Aubergine in Scheiben, mit Passata und Mozzarella schichten, 25 Min bei 200 °C backen, Couscous dazu.', OVEN);
  R('kartoffelgratin', 'Kartoffel-Käse-Gratin mit Ei', 45, 'kartoffel', [], { kartoffeln: 600, gouda: 100, milch: 150, eier: 2, spinat: 100 }, 'Kartoffelscheiben mit Spinat schichten, Milch-Ei-Mischung und Käse darüber, 35 Min bei 190 °C backen.', OVENONLY);
  R('suessbohnenboote', 'Süßkartoffel-Boote mit Bohnen & Skyr', 45, 'kartoffel', [], { suesskart: 800, sbohnen: 240, mais: 100, skyr: 150 }, 'Süßkartoffeln 35 Min bei 200 °C backen, mit Bohnen und Mais füllen, Skyr dazu.', OVENONLY);
  R('paprikagefuellt', 'Gefüllte Paprika mit Couscous & Feta', 40, 'ofen', [], { paprika: 3, couscous: 100, feta: 100, kichererbsen: 250, tomatenmark: 20 }, 'Paprika halbieren, mit Couscous, Kichererbsen, Feta und Tomatenmark füllen, 25 Min bei 200 °C backen.', OVENONLY);
  R('blumenkohlcurry', 'Blumenkohl-Kichererbsen-Curry', 30, 'bohnen', [], { blumenkohl: 1, kichererbsen: 500, kokosmilch: 200, currypaste: 30, reis: 100 }, 'Blumenkohl anbraten, Currypaste, Kokosmilch und Kichererbsen zugeben und 15 Min köcheln. Reis separat kochen.');
  R('kuerbishalloumi', 'Kürbis-Halloumi-Pfanne', 30, 'kaese', [], { kuerbis: 500, halloumi: 200, zwiebeln: 100, reis: 100 }, 'Kürbiswürfel mit Zwiebel braten, Halloumi dazu, mit Reis servieren.');
  R('pitapizza', 'Pita-Pizza mit Mozzarella', 15, 'kaese', E, { pita: 4, passata: 150, mozzarella: 250, tomaten: 150 }, 'Pita mit Passata bestreichen, Tomate und Mozzarella darauf, 10 Min bei 220 °C backen.', OVENONLY);

  // --- Salate & Bowls ---
  R('bulgursalat', 'Bulgur-Salat mit Kichererbsen & Feta', 20, 'bowl', E, { bulgur: 120, kichererbsen: 250, gurke: 1, tomaten: 250, feta: 100 }, 'Bulgur mit heißem Wasser quellen lassen, mit allem anderen mischen.', NONE);
  R('quinoabowl', 'Quinoa-Bowl mit Avocado & Bohnen', 20, 'bowl', E, { quinoa: 120, sbohnen: 240, edamame: 150, avocado: 1, tomaten: 200, mais: 100 }, 'Quinoa 12 Min kochen, Edamame garen, mit Bohnen, Mais, Tomaten und Avocado anrichten.');
  R('linsensalat', 'Linsen-Salat mit Feta', 10, 'linsen', E, { linsendose: 500, gurke: 1, tomaten: 200, feta: 100, zwiebeln: 50 }, 'Linsen abspülen, mit gewürfeltem Gemüse und Feta mischen.', NONE);
  R('capresebrot', 'Caprese-Brot mit Rucola', 10, 'kaese', E, { brot: 200, mozzarella: 250, tomaten: 250, rucola: 60, pesto: 30 }, 'Brot mit Pesto bestreichen, mit Tomate, Mozzarella und Rucola belegen.', NONE);
  R('dipteller', 'Hummus-Dip-Teller mit Brot & Rohkost', 10, 'dip', D, { brot: 200, hummus: 200, gurke: 1, karotten: 200, paprika: 1, feta: 100 }, 'Gemüse in Streifen schneiden, mit Brot, Hummus und Feta anrichten.', NONE);
  R('bohnendip', 'Weiße-Bohnen-Dip mit Brot & Gemüse', 10, 'dip', D, { wbohnen: 240, quark: 100, brot: 200, karotten: 150, tomaten: 150 }, 'Bohnen mit Quark, Salz und Zitronensaft pürieren, mit Brot und Gemüse servieren.', NONE);
  R('kichersuessbowl', 'Kichererbsen-Süßkartoffel-Bowl', 35, 'bowl', [], { suesskart: 500, kichererbsen: 480, spinat: 100, skyr: 200 }, 'Süßkartoffelwürfel 25 Min bei 200 °C rösten, mit Kichererbsen, Spinat und Skyr anrichten.', OVENONLY);
  R('pilzrisotto', 'Pilz-Risotto mit Erbsen & Parmesan', 35, 'reis', [], { reis: 160, champignons: 300, zwiebeln: 100, parmesan: 60, erbsen: 200 }, 'Zwiebel und Pilze anbraten, Reis mit 600 ml heißem Wasser nach und nach garen, Erbsen und Parmesan unterrühren.');
  R('spinatlasagne', 'Spinat-Ricotta-Lasagne aus der Pfanne', 30, 'pasta', [], { nudeln: 200, ricotta: 250, tkspinat: 200, passata: 300, mozzarella: 125 }, 'Nudeln halb garen, mit Ricotta-Spinat-Mischung und Passata in einer Form schichten, Mozzarella darüber, 15 Min bei 200 °C überbacken.', OVEN);
  R('raeuchernudeln', 'Räuchertofu-Nudeln mit Erbsen', 20, 'pasta', E, { nudeln: 200, raeuchertofu: 200, erbsen: 150, frischkaese: 100 }, 'Tofuwürfel anbraten, Erbsen und Frischkäse zugeben, mit Nudeln mischen.');

  // --- Snacks (1 Portion) ---
  const S = { type: 'snack', serv: 1 }, SN = Object.assign({ tools: [] }, S);
  R('s-skyrbeeren', 'Skyr mit Beeren & Mandeln', 3, 'snack', E, { skyr: 250, beeren: 100, mandeln: 15 }, 'Skyr mit aufgetauten Beeren und gehackten Mandeln mischen.', SN);
  R('s-porridge', 'Protein-Porridge mit Banane', 8, 'snack', [], { haferflocken: 60, milch: 200, banane: 1, quark: 100 }, 'Haferflocken in Milch aufkochen, Banane zerdrücken und mit Quark unterrühren.', Object.assign({ tools: ['herd'] }, S));
  R('s-hummus', 'Hummus mit Rohkost', 5, 'snack', D, { hummus: 60, karotten: 100, gurke: 0.5 }, 'Gemüse in Stifte schneiden und in Hummus dippen.', SN);
  R('s-apfel', 'Apfel mit Erdnussmus', 3, 'snack', E, { aepfel: 200, erdnussmus: 20 }, 'Apfel in Spalten schneiden, Erdnussmus zum Dippen.', SN);
  R('s-reiswaffel', 'Reiswaffeln mit Frischkäse & Gurke', 3, 'snack', E, { reiswaffeln: 30, frischkaese: 40, gurke: 0.5 }, 'Reiswaffeln bestreichen und mit Gurke belegen.', SN);
  R('s-nussmix', 'Nuss-Dattel-Mix', 2, 'snack', E, { mandeln: 20, walnuss: 15, datteln: 30 }, 'Alles in eine Dose geben.', SN);
  R('s-joghurtnuss', 'Joghurt mit Honig & Walnüssen', 3, 'snack', E, { joghurt: 200, honig: 10, walnuss: 15 }, 'Joghurt mit Honig und gehackten Walnüssen servieren.', SN);
  R('s-popcorn', 'Popcorn (selbst gemacht)', 8, 'snack', [], { popcorn: 40 }, 'Mais mit etwas Öl im geschlossenen Topf poppen, leicht salzen.', Object.assign({ tools: ['herd'] }, S));
  R('s-huettenkaese', 'Hüttenkäse mit Gurke & Tomate', 4, 'snack', E, { huettenk: 200, gurke: 0.5, tomaten: 100 }, 'Gemüse würfeln und mit Hüttenkäse mischen.', SN);
  R('s-knaecke', 'Knäckebrot mit Frischkäse & Tomate', 3, 'snack', E, { knaecke: 40, frischkaese: 40, tomaten: 80 }, 'Knäckebrot bestreichen und mit Tomate belegen.', SN);
  R('s-edamame', 'Warme Edamame', 6, 'snack', E, { edamame: 150 }, 'Edamame 4 Min dämpfen oder kochen, mit Salz bestreuen.', Object.assign({ tools: ['herd'] }, S));
  R('s-schokoquark', 'Schoko-Bananen-Quark', 4, 'snack', E, { quark: 150, schoko: 15, banane: 1 }, 'Quark mit Bananenscheiben und geraspelter Schokolade mischen.', SN);
  R('s-guaca', 'Guacamole mit Tortilla-Chips', 8, 'snack', D, { avocado: 1, tomaten: 50, tortillachips: 40 }, 'Avocado zerdrücken, mit Tomatenwürfeln und Salz mischen, Chips dazu.', SN);
  R('s-eierbrot', 'Gekochte Eier mit Brot', 12, 'snack', E, { eier: 2, brot: 50 }, 'Eier 8 Min kochen, mit Brot essen.', Object.assign({ tools: ['herd'] }, S));
  R('s-muesli', 'Müsli-Joghurt mit Kürbiskernen', 3, 'snack', E, { joghurt: 200, haferflocken: 30, kuerbiskerne: 10 }, 'Alles in einer Schale mischen.', SN);
})();
