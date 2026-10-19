// Noch mehr Katalogartikel und Rezepte (nach data-more.js laden). Format wie dort.
// Rezeptmengen gelten für 2 Portionen (Snacks: 1 Portion). Öl, Salz, Gewürze, Knoblauch, Kräuter, Zitronensaft, Essig, Brühe gelten als vorhanden.
(function () {
  const I = (id, name, cat, unit, pack, price, shelf, storage, n, allergens, est) =>
    CATALOG.push({ id, name, cat, unit, pack, price, shelf, storage, n, allergens: allergens || [], est: est !== false });
  const OG = 'Obst & Gemüse', KR = 'Kühlregal', VR = 'Vorrat', TK = 'Tiefkühl', BR = 'Brot';

  // --- Gemüse & Obst ---
  I('lauchzw', 'Frühlingszwiebeln (Bund)', OG, 'Stk', 1, 0.89, 7, 'kuehl', [30, 2, 5, 0.3, 2.5]);
  I('kohlrabi', 'Kohlrabi (Stück)', OG, 'Stk', 1, 0.79, 10, 'kuehl', [30, 2, 6, 0.2, 3]);
  I('weisskohl', 'Weißkohl ca. 1 kg', OG, 'g', 1000, 1.29, 30, 'kuehl', [25, 1.4, 4, 0.2, 2.5]);
  I('rotkohl', 'Rotkohl ca. 1 kg', OG, 'g', 1000, 1.49, 30, 'kuehl', [27, 1.5, 5, 0.2, 2.5]);
  I('rotebeete', 'Rote Bete vorgegart 500 g', OG, 'g', 500, 1.49, 30, 'kuehl', [43, 1.7, 8, 0.1, 3]);
  I('fenchel', 'Fenchel (Stück)', OG, 'Stk', 1, 1.19, 7, 'kuehl', [60, 3, 12, 0.8, 8]);
  I('ingwer', 'Ingwer 100 g', OG, 'g', 100, 0.99, 21, 'kuehl', [80, 1.8, 15, 0.8, 2]);
  I('orangen', 'Orangen 1 kg', OG, 'g', 1000, 1.79, 14, 'vorrat', [47, 0.9, 9, 0.2, 2.2]);
  I('rosenkohl', 'TK-Rosenkohl 750 g', TK, 'g', 750, 1.79, 180, 'gefrier', [43, 4, 5, 0.4, 4]);
  I('mango', 'TK-Mangostücke 500 g', TK, 'g', 500, 2.29, 180, 'gefrier', [60, 0.8, 13, 0.4, 1.5]);

  // --- Vorrat: Gläser, Dosen, Trockenware ---
  I('oliven', 'Oliven entsteint, Glas 200 g', VR, 'g', 200, 1.29, 365, 'vorrat', [145, 1, 4, 14, 3]);
  I('sonnentomaten', 'Getrocknete Tomaten in Öl 190 g', VR, 'g', 190, 1.69, 180, 'vorrat', [200, 5, 20, 11, 7]);
  I('artischocken', 'Artischockenherzen Glas 240 g', VR, 'g', 240, 1.99, 365, 'vorrat', [45, 2, 6, 1, 5]);
  I('ajvar', 'Ajvar mild 200 g', VR, 'g', 200, 1.39, 365, 'vorrat', [90, 1.5, 9, 5, 2]);
  I('sojaschnetzel', 'Sojaschnetzel 200 g', VR, 'g', 200, 1.99, 365, 'vorrat', [330, 50, 20, 1, 13], ['soja']);
  I('tellerlinsen', 'Tellerlinsen 500 g', VR, 'g', 500, 1.69, 365, 'vorrat', [340, 24, 50, 1.5, 11]);
  I('polenta', 'Polenta (Instant) 500 g', VR, 'g', 500, 1.19, 365, 'vorrat', [350, 8, 75, 1, 3]);
  I('lasagne', 'Lasagneplatten 250 g', VR, 'g', 250, 1.29, 365, 'vorrat', [350, 12, 72, 1.5, 3], ['gluten']);
  I('sojadrink', 'Sojadrink 1 l', VR, 'ml', 1000, 1.19, 180, 'vorrat', [39, 3.3, 2.5, 1.8, 0.5], ['soja']);
  I('hafermilch', 'Haferdrink 1 l', VR, 'ml', 1000, 1.29, 180, 'vorrat', [45, 1, 6.5, 1.5, 0.8], ['gluten']);
  I('muesli', 'Müsli ohne Zuckerzusatz 750 g', VR, 'g', 750, 2.19, 365, 'vorrat', [370, 12, 60, 8, 9], ['gluten', 'nuesse']);
  I('chia', 'Chiasamen 200 g', VR, 'g', 200, 2.49, 365, 'vorrat', [490, 17, 8, 31, 34]);
  I('leinsamen', 'Leinsamen 250 g', VR, 'g', 250, 1.49, 365, 'vorrat', [500, 18, 2, 40, 27]);
  I('sonnenblumenkerne', 'Sonnenblumenkerne 200 g', VR, 'g', 200, 1.19, 365, 'vorrat', [580, 21, 10, 48, 9]);
  I('tahini', 'Tahini (Sesammus) 250 g', VR, 'g', 250, 2.99, 365, 'vorrat', [600, 18, 12, 54, 9]);
  I('kakao', 'Backkakao 125 g', VR, 'g', 125, 1.29, 365, 'vorrat', [230, 20, 10, 11, 30]);
  I('rosinen', 'Rosinen 250 g', VR, 'g', 250, 1.19, 365, 'vorrat', [300, 3, 70, 0.5, 4]);
  I('aprikosen', 'Getrocknete Aprikosen 200 g', VR, 'g', 200, 1.79, 365, 'vorrat', [240, 3.5, 50, 0.5, 7]);

  // --- Kühlregal & Brot ---
  I('seitan', 'Seitan natur 200 g', KR, 'g', 200, 2.19, 21, 'kuehl', [120, 24, 4, 1, 1], ['gluten']);
  I('veggieburger', 'Veggie-Burger-Patties (2 Stück)', KR, 'Stk', 2, 2.29, 14, 'kuehl', [210, 14, 14, 10, 3], ['gluten', 'soja']);
  I('veggiewurst', 'Vegetarische Würstchen 200 g', KR, 'g', 200, 1.99, 14, 'kuehl', [220, 17, 8, 13, 3], ['gluten', 'soja']);
  I('griechjoghurt', 'Griechischer Joghurt 10 % 500 g', KR, 'g', 500, 1.79, 14, 'kuehl', [120, 5, 4, 10, 0], ['laktose']);
  I('sojajoghurt', 'Sojajoghurt natur 400 g', KR, 'g', 400, 1.19, 14, 'kuehl', [50, 4, 2, 2.3, 0.5], ['soja']);
  I('kochsahne', 'Kochcreme 15 % 200 ml', KR, 'ml', 200, 0.79, 30, 'kuehl', [150, 2.5, 4, 14, 0], ['laktose']);
  I('ziegenkaese', 'Ziegenfrischkäse 125 g', KR, 'g', 125, 1.69, 21, 'kuehl', [260, 17, 2, 21, 0], ['laktose']);
  I('camembert', 'Camembert 125 g', KR, 'g', 125, 1.29, 21, 'kuehl', [300, 20, 0.5, 24, 0], ['laktose']);
  I('reibekaese', 'Reibekäse Pizza 200 g', KR, 'g', 200, 1.49, 21, 'kuehl', [300, 22, 1, 23, 0], ['laktose']);
  I('blaetterteig', 'Blätterteig 275 g', KR, 'g', 275, 1.49, 21, 'kuehl', [380, 6, 40, 22, 2], ['gluten']);
  I('pizzateig', 'Pizzateig frisch 400 g', KR, 'g', 400, 1.59, 14, 'kuehl', [270, 8, 52, 3, 2.5], ['gluten']);
  I('spaetzle', 'Spätzle frisch 500 g', KR, 'g', 500, 1.79, 21, 'kuehl', [165, 6, 30, 2, 1.5], ['gluten']);
  I('pommes', 'TK-Kartoffelecken 750 g', TK, 'g', 750, 1.99, 180, 'gefrier', [150, 3, 25, 4.5, 3]);
  I('toast', 'Vollkorn-Toast 500 g', BR, 'g', 500, 1.09, 10, 'vorrat', [250, 9, 42, 3.5, 6], ['gluten']);
  I('burgerbroetchen', 'Burgerbrötchen (4 Stück)', BR, 'Stk', 4, 1.29, 5, 'vorrat', [200, 6, 38, 3, 2], ['gluten']);
  I('baguette', 'Aufbackbaguette (2 Stück)', BR, 'Stk', 2, 0.99, 180, 'vorrat', [330, 10, 65, 2, 3], ['gluten']);

  // --- Rezepte ---
  const R = (id, name, min, group, tags, ing, steps, o) => RECIPES.push(Object.assign({ id, name, min, group, tags, ing, steps, tools: ['herd'] }, o || {}));
  const OVEN = { tools: ['backofen', 'herd'] }, OVENONLY = { tools: ['backofen'] }, NONE = { tools: [] };
  const E = ['einfach'], D = ['einfach', 'dip'], T = ['eintopf'];

  // Nudeln, Gnocchi, Spätzle, Lasagne
  R('sojabolo', 'Nudeln mit Soja-Bolognese', 25, 'pasta', E, { nudeln: 200, sojaschnetzel: 80, passata: 500, zwiebeln: 100, karotten: 100, parmesan: 20 }, 'Sojaschnetzel in heißem Wasser quellen lassen und ausdrücken. Mit Zwiebel und Karotte anbraten, Passata zugeben, 15 Min köcheln. Nudeln kochen.');
  R('carbonaraveg', 'Spaghetti Carbonara mit Räuchertofu', 20, 'pasta', E, { nudeln: 200, raeuchertofu: 200, eier: 2, parmesan: 40, zwiebeln: 50 }, 'Tofuwürfel mit Zwiebel anbraten. Eier mit Parmesan verquirlen, mit den heißen Nudeln und dem Tofu mischen, bis eine cremige Soße entsteht.');
  R('arrabbiatabohnen', 'Pasta Arrabbiata mit Kidneybohnen', 20, 'pasta', E, { nudeln: 200, passata: 400, kidney: 240, zwiebeln: 50, parmesan: 20 }, 'Zwiebel mit reichlich Chili anbraten, Passata und Bohnen 10 Min köcheln, mit den Nudeln mischen.');
  R('ziegenkaesenudeln', 'Nudeln mit Ziegenkäse, Tomaten & Rucola', 15, 'pasta', E, { nudeln: 200, ziegenkaese: 125, tomaten: 250, rucola: 60, walnuss: 20 }, 'Nudeln kochen, Tomatenwürfel kurz erwärmen, Ziegenkäse unterrühren, Rucola und Walnüsse darüber.');
  R('kaesespaetzle', 'Käsespätzle mit Röstzwiebeln & Erbsen', 25, 'pasta', [], { spaetzle: 500, gouda: 150, zwiebeln: 200, erbsen: 150 }, 'Zwiebeln langsam goldbraun braten. Spätzle mit Erbsen erhitzen, Käse darin schmelzen, Zwiebeln darüber.');
  R('spaetzlespinat', 'Spätzle-Pfanne mit Spinat, Feta & Ei', 20, 'pasta', E, { spaetzle: 500, tkspinat: 200, feta: 100, eier: 3 }, 'Spätzle anbraten, Spinat zugeben, Eier hineinrühren, Feta darüberbröseln.');
  R('lasagnelinsen', 'Linsen-Lasagne', 50, 'pasta', [], { lasagne: 200, linsen: 100, passata: 400, ricotta: 250, mozzarella: 125, zwiebeln: 100 }, 'Linsen mit Zwiebel und Passata 15 Min kochen. Mit Platten und Ricotta schichten, Mozzarella darauf, 30 Min bei 200 °C backen.', OVENONLY);
  R('lasagnegemuese', 'Gemüse-Lasagne mit Mozzarella', 55, 'pasta', [], { lasagne: 200, zucchini: 300, aubergine: 1, passata: 300, mozzarella: 250, quark: 150 }, 'Gemüse anbraten, mit Passata, Quark und Platten schichten, Mozzarella darauf, 30 Min bei 200 °C backen.', OVENONLY);
  R('brokkolifeta', 'Nudeln mit Brokkoli, Feta & Mandeln', 20, 'pasta', E, { nudeln: 200, brokkoli: 300, feta: 100, mandeln: 20 }, 'Brokkoli in den letzten 4 Min im Nudelwasser mitgaren. Mit Feta und gerösteten Mandeln mischen.');
  R('champsahne', 'Pilz-Rahm-Nudeln mit Erbsen', 20, 'pasta', E, { nudeln: 200, champignons: 300, kochsahne: 150, parmesan: 20, erbsen: 100 }, 'Pilze scharf anbraten, Kochcreme und Erbsen zugeben, mit den Nudeln und Parmesan mischen.');
  R('tortellinitomate', 'Tortelloni in Tomatensoße mit Rucola', 15, 'pasta', E, { tortelloni: 500, passata: 300, rucola: 40, parmesan: 20 }, 'Tortelloni kochen, mit heißer Passata mischen, Rucola und Parmesan darüber.');
  R('gnocchipestoerbsen', 'Gnocchi mit Pesto & Erbsen', 12, 'pasta', E, { gnocchi: 500, pesto: 40, erbsen: 150, parmesan: 20 }, 'Gnocchi in der Pfanne knusprig braten, Erbsen und Pesto unterheben, Parmesan darüber.');
  R('gnocchiofen', 'Gnocchi-Auflauf mit Zucchini & Mozzarella', 35, 'ofen', [], { gnocchi: 500, passata: 300, mozzarella: 125, zucchini: 200, ricotta: 125 }, 'Alles in einer Form mischen, Mozzarella obenauf, 25 Min bei 200 °C backen.', OVENONLY);
  R('ajvarnudeln', 'Ajvar-Nudeln mit Kichererbsen & Feta', 15, 'pasta', E, { nudeln: 200, ajvar: 100, feta: 100, kichererbsen: 250 }, 'Nudeln kochen, Ajvar mit Kichererbsen erwärmen, mischen und Feta darüber.');
  R('kuerbisnudeln', 'Kürbis-Nudeln mit Ricotta & Walnüssen', 30, 'pasta', [], { nudeln: 200, kuerbis: 400, ricotta: 150, walnuss: 20, zwiebeln: 50 }, 'Kürbiswürfel mit Zwiebel weich braten, leicht zerdrücken. Mit Nudeln und Ricotta mischen, Walnüsse darüber.');
  R('sonnentomatenpasta', 'Pasta mit getrockneten Tomaten & Ricotta', 15, 'pasta', E, { nudeln: 200, sonnentomaten: 80, ricotta: 250, rucola: 50, mandeln: 20 }, 'Nudeln kochen, mit gehackten Tomaten und Ricotta mischen, Rucola und Mandeln darüber.');
  R('nudelfrittata', 'Nudel-Frittata mit Gemüse & Käse', 20, 'ei', E, { nudeln: 150, eier: 6, tkgemuese: 200, gouda: 50 }, 'Gekochte Nudeln mit Gemüse anbraten, verquirlte Eier und Käse darübergeben, bei kleiner Hitze stocken lassen.');
  R('nudelsalatmozza', 'Nudelsalat mit Mozzarella & Pesto', 15, 'salat', E, { nudeln: 200, mozzarella: 250, tomaten: 250, rucola: 50, pesto: 30 }, 'Nudeln kochen und abkühlen, mit allen Zutaten mischen.', NONE);
  R('nudelbohnenpesto', 'Pesto-Nudeln mit weißen Bohnen', 15, 'pasta', E, { nudeln: 200, wbohnen: 240, pesto: 40, tomaten: 200 }, 'Nudeln kochen, Bohnen und Tomatenwürfel kurz erwärmen, mit Pesto mischen.');
  R('nudelkaeselauch', 'Käse-Lauch-Nudeln', 20, 'pasta', E, { nudeln: 200, lauch: 2, kochsahne: 100, gouda: 100, quark: 100 }, 'Lauch in Ringen anbraten, Kochcreme und Quark zugeben, Käse schmelzen, Nudeln unterheben.');

  // Suppen & Eintöpfe
  R('rotelinsensuppe', 'Rote-Linsen-Suppe mit Kokos & Ingwer', 25, 'suppe', T, { linsen: 150, kokosmilch: 200, karotten: 150, zwiebeln: 100, ingwer: 15, brot: 100 }, 'Zwiebel, Karotte und Ingwer anbraten, Linsen und 600 ml Wasser zugeben, 15 Min köcheln, Kokosmilch einrühren. Brot dazu.');
  R('tomatenlinsensuppe', 'Tomaten-Linsen-Suppe', 25, 'suppe', T, { tellerlinsen: 150, passata: 400, karotten: 150, zwiebeln: 100, skyr: 100 }, 'Gemüse anbraten, Linsen, Passata und 500 ml Wasser 20 Min köcheln, Skyr als Klecks darauf.');
  R('minestrone', 'Minestrone mit weißen Bohnen', 30, 'suppe', T, { wbohnen: 240, tkgemuese: 300, dosentom: 400, nudeln: 80, parmesan: 20 }, 'Gemüse und Tomaten mit 500 ml Wasser köcheln, Bohnen und Nudeln darin garen, Parmesan darüber.');
  R('kichererbseneintopf', 'Marokkanischer Kichererbsen-Eintopf', 30, 'suppe', T, { kichererbsen: 480, dosentom: 400, suesskart: 300, zwiebeln: 100, couscous: 60 }, 'Zwiebel und Süßkartoffel anbraten, Tomaten und Kichererbsen mit Kreuzkümmel und Zimt 20 Min köcheln, Couscous als Beilage quellen lassen.');
  R('brokkolisuppe', 'Brokkoli-Cremesuppe mit Frischkäse', 20, 'suppe', T, { brokkoli: 500, kartoffeln: 200, frischkaese: 100, wbohnen: 240, zwiebeln: 50, brot: 100 }, 'Kartoffel, Zwiebel und Brokkoli in 500 ml Wasser garen, Frischkäse zugeben, pürieren. Brot dazu.');
  R('tomatensuppequark', 'Tomatensuppe mit Quark & Brotcroutons', 20, 'suppe', T, { passata: 500, quark: 200, kichererbsen: 250, zwiebeln: 50, brot: 100 }, 'Zwiebel anbraten, Passata und 200 ml Wasser erhitzen, Quark einrühren. Brot würfeln und rösten.');
  R('gemuesecurrysuppe', 'Gemüse-Curry-Suppe mit Tofu', 25, 'suppe', T, { tofu: 200, tkgemuese: 400, kokosmilch: 200, currypaste: 20, reisnudeln: 100 }, 'Currypaste anbraten, Kokosmilch und 400 ml Wasser zugeben, Gemüse und Tofu darin garen, Reisnudeln unterheben.');
  R('kartoffeleintopf', 'Kartoffel-Bohnen-Eintopf mit Veggie-Würstchen', 30, 'suppe', T, { kartoffeln: 500, wbohnen: 240, karotten: 150, veggiewurst: 200, zwiebeln: 100 }, 'Kartoffeln, Karotten und Zwiebel in 600 ml Wasser garen, Bohnen und Würstchenscheiben zugeben, kurz erhitzen.');
  R('erbsensuppefrisch', 'Süßkartoffel-Erbsen-Suppe', 25, 'suppe', T, { suesskart: 400, erbsen: 300, zwiebeln: 100, griechjoghurt: 150, feta: 80, eier: 2 }, 'Zwiebel und Süßkartoffel in 500 ml Wasser garen, Erbsen zugeben, pürieren, Joghurt darauf.');
  R('rotkohleintopf', 'Rotkohl-Linsen-Eintopf', 35, 'suppe', T, { rotkohl: 400, tellerlinsen: 150, aepfel: 200, zwiebeln: 100, kartoffeln: 300 }, 'Alles klein schneiden, mit 700 ml Wasser 25 Min köcheln, mit Essig abschmecken.');
  R('kohlrabisuppe', 'Kohlrabi-Kartoffel-Suppe mit Ei', 25, 'suppe', T, { kohlrabi: 2, kartoffeln: 300, zwiebeln: 50, eier: 4, frischkaese: 50 }, 'Gemüse in 500 ml Wasser garen, mit Frischkäse pürieren, mit halbierten gekochten Eiern servieren.');
  R('chilibohnen', 'Chili mit Sojaschnetzel', 30, 'bohnen', T, { sojaschnetzel: 60, kidney: 240, mais: 150, dosentom: 400, paprika: 1, zwiebeln: 100, reis: 100 }, 'Sojaschnetzel quellen lassen. Mit Zwiebel und Paprika anbraten, Bohnen, Mais und Tomaten 15 Min köcheln. Reis separat kochen.');
  R('graupenlinsen', 'Linsen-Gemüse-Topf mit Kartoffeln', 30, 'suppe', T, { tellerlinsen: 150, kartoffeln: 400, karotten: 200, lauch: 1, quark: 100 }, 'Alles in 600 ml Wasser 25 Min garen, mit einem Klecks Quark servieren.');
  R('mangoldfenchel', 'Fenchel-Kartoffel-Suppe mit Feta', 30, 'suppe', T, { fenchel: 2, kartoffeln: 300, zwiebeln: 50, feta: 100, wbohnen: 240, brot: 100 }, 'Fenchel und Kartoffel in 500 ml Wasser garen, pürieren, Feta darüber, Brot dazu.');
  R('bohnengemuesesuppe', 'Schnelle Bohnen-Gemüse-Suppe', 20, 'suppe', T, { wbohnen: 480, tkgemuese: 300, passata: 300, parmesan: 20 }, 'Alles mit 300 ml Wasser 15 Min köcheln, Parmesan darüber.');

  // Eier & Frühstück
  R('spiegeleiavocado', 'Spiegeleier auf Avocado-Toast', 10, 'ei', E, { toast: 150, eier: 4, avocado: 1, tomaten: 150 }, 'Toast rösten, Avocado darauf zerdrücken, Spiegeleier und Tomatenscheiben darauflegen.');
  R('eiersalat', 'Eiersalat mit Skyr auf Vollkornbrot', 15, 'ei', E, { eier: 6, skyr: 100, gurke: 1, brot: 150 }, 'Eier 9 Min kochen, würfeln, mit Skyr und Gurkenwürfeln mischen, auf Brot.', NONE);
  R('omelettchampignon', 'Champignon-Omelett mit Ziegenkäse', 15, 'ei', E, { eier: 6, champignons: 250, ziegenkaese: 60 }, 'Pilze scharf anbraten, verquirlte Eier darübergeben, stocken lassen, Ziegenkäse darauf.');
  R('rueheiertomate', 'Rührei mit Tomaten & Frühlingszwiebeln', 10, 'ei', E, { eier: 6, tomaten: 200, lauchzw: 1, toast: 100 }, 'Zwiebeln und Tomaten anbraten, Eier einrühren, mit Toast servieren.');
  R('pfannkuchenherz', 'Herzhafte Pfannkuchen mit Spinat & Feta', 25, 'ei', [], { mehl: 120, eier: 3, milch: 250, tkspinat: 150, feta: 100 }, 'Teig aus Mehl, Eiern und Milch rühren, Pfannkuchen backen, mit Spinat und Feta füllen.');
  R('eiermuffins', 'Gemüse-Eier-Muffins', 30, 'ei', E, { eier: 6, tkgemuese: 200, reibekaese: 60, mais: 80 }, 'Alles verquirlen, in Muffinformen füllen, 20 Min bei 190 °C backen.', OVENONLY);
  R('shakshukafeta', 'Shakshuka mit Feta & Kichererbsen', 25, 'ei', E, { eier: 4, dosentom: 400, kichererbsen: 250, feta: 80, paprika: 1, brot: 100 }, 'Paprika anbraten, Tomaten und Kichererbsen einkochen, Eier darin garen, Feta darüber.');
  R('kaiserschmarrn', 'Kaiserschmarrn mit Quark-Beeren', 25, 'suess', [], { mehl: 120, eier: 3, milch: 250, quark: 250, beeren: 150, honig: 15 }, 'Teig aus Mehl, Eiern und Milch backen, zerreißen und karamellisieren. Quark und Beeren dazu.');
  R('eierwrap', 'Ei-Spinat-Wraps', 15, 'wrap', E, { wraps: 4, eier: 4, spinat: 100, frischkaese: 60, tomaten: 150 }, 'Rührei mit Spinat zubereiten, Wraps mit Frischkäse bestreichen, füllen und aufrollen.');
  R('tortillaspanisch', 'Spanische Tortilla mit Zwiebeln', 35, 'kartoffel', [], { kartoffeln: 500, eier: 6, zwiebeln: 150, joghurt: 100 }, 'Kartoffel- und Zwiebelscheiben weich braten, Eier darübergießen, beidseitig stocken lassen. Joghurt dazu.');
  R('eiergrie', 'Frühstücks-Bowl mit Eiern & Linsen', 15, 'bowl', E, { eier: 4, linsendose: 250, spinat: 100, tomaten: 150, joghurt: 100 }, 'Linsen erwärmen, Eier kochen, mit Spinat, Tomate und Joghurt anrichten.');
  R('rueherueberaschung', 'Tofu-Rührei mit Kurkuma & Brot', 15, 'tofu', E, { tofu: 400, paprika: 1, lauchzw: 1, toast: 150 }, 'Tofu zerbröseln, mit Paprika und Kurkuma anbraten, mit Toast servieren.');
  R('frittatakartoffel', 'Kartoffel-Frittata mit Erbsen', 30, 'ei', E, { kartoffeln: 400, eier: 6, erbsen: 100, feta: 60 }, 'Gekochte Kartoffelscheiben mit Erbsen anbraten, Eier darübergießen, stocken lassen, Feta darüber.');
  R('brotpudding', 'Herzhafter Brot-Auflauf mit Ei & Käse', 40, 'ofen', [], { toast: 200, eier: 4, milch: 250, gouda: 100, tkspinat: 100 }, 'Toast würfeln, mit Spinat in eine Form geben, Ei-Milch-Mischung und Käse darüber, 30 Min bei 180 °C backen.', OVENONLY);

  // Reis, Getreide, Pfannen
  R('reispfannesoja', 'Reis-Pfanne mit Sojaschnetzel & Gemüse', 25, 'reis', E, { reis: 140, sojaschnetzel: 60, tkgemuese: 300, sojasauce: 25 }, 'Sojaschnetzel quellen lassen, anbraten, Gemüse und gekochten Reis zugeben, mit Sojasoße abschmecken.');
  R('risottokuerbis', 'Kürbis-Risotto mit Parmesan', 40, 'reis', [], { reis: 160, kuerbis: 400, zwiebeln: 100, parmesan: 50, quark: 100 }, 'Zwiebel und Kürbis anbraten, Reis mit 600 ml heißem Wasser nach und nach garen, Parmesan und Quark unterrühren.');
  R('risottospargel', 'Erbsen-Risotto mit Ricotta', 35, 'reis', [], { reis: 160, erbsen: 250, ricotta: 150, zwiebeln: 100, parmesan: 30 }, 'Zwiebel anbraten, Reis mit Wasser garen, Erbsen zugeben, Ricotta und Parmesan unterziehen.');
  R('paella', 'Gemüse-Paella mit Kichererbsen', 35, 'reis', [], { reis: 160, kichererbsen: 250, paprika: 2, erbsen: 100, tomaten: 150, zwiebeln: 100 }, 'Gemüse anbraten, Reis mit Paprikapulver und Safran zugeben, mit Wasser garen, Kichererbsen und Erbsen unterheben.');
  R('reiskaesebrokkoli', 'Brokkoli-Käse-Reis-Pfanne', 25, 'reis', E, { reis: 140, brokkoli: 400, gouda: 100, eier: 2 }, 'Reis kochen, Brokkoli anbraten, Reis, Eier und Käse zugeben und rühren, bis alles gestockt ist.');
  R('couscousgemuese', 'Couscous mit Ofengemüse & Halloumi', 30, 'kaese', [], { couscous: 120, halloumi: 200, zucchini: 300, paprika: 1, tomaten: 150 }, 'Gemüse 20 Min bei 200 °C rösten, Halloumi in den letzten 8 Min mitbacken, Couscous quellen lassen.', OVENONLY);
  R('bulgurpfanne', 'Bulgur-Pfanne mit Bohnen & Paprika', 25, 'reis', E, { bulgur: 120, kidney: 240, paprika: 2, mais: 100, tomatenmark: 20 }, 'Paprika anbraten, Tomatenmark, Bulgur und 300 ml Wasser zugeben, 10 Min quellen, Bohnen und Mais unterheben.');
  R('polentakaese', 'Polenta mit Ofengemüse & Ziegenkäse', 35, 'ofen', [], { polenta: 150, zucchini: 300, tomaten: 250, ziegenkaese: 125, parmesan: 20 }, 'Polenta mit 600 ml Wasser kochen. Gemüse 20 Min bei 200 °C rösten, mit Ziegenkäse auf der Polenta anrichten.', OVEN);
  R('polentapilz', 'Cremige Polenta mit Pilzen & Spiegelei', 25, 'reis', [], { polenta: 150, champignons: 300, parmesan: 30, eier: 2, spinat: 100 }, 'Polenta kochen, Parmesan unterrühren. Pilze und Spinat anbraten, mit Spiegelei servieren.');
  R('quinoapfanne', 'Quinoa-Pfanne mit Halloumi & Zucchini', 25, 'bowl', [], { quinoa: 120, halloumi: 200, zucchini: 300, tomaten: 150 }, 'Quinoa 12 Min kochen, Halloumi und Zucchini anbraten, alles mischen.');
  R('quinoasuess', 'Quinoa-Süßkartoffel-Pfanne mit Feta', 30, 'bowl', [], { quinoa: 100, suesskart: 400, feta: 100, spinat: 100, kichererbsen: 250 }, 'Süßkartoffelwürfel braten, mit Quinoa, Kichererbsen und Spinat mischen, Feta darüber.');
  R('couscousfenchel', 'Couscous mit Fenchel, Orange & Feta', 20, 'salat', E, { couscous: 120, fenchel: 1, orangen: 200, feta: 100, kichererbsen: 250 }, 'Couscous quellen lassen, mit Fenchelscheiben, Orangenfilets, Kichererbsen und Feta mischen.', NONE);
  R('reismitei', 'Ei-Gemüse-Reispfanne mit Sojasoße', 20, 'reis', E, { reis: 140, eier: 4, tkgemuese: 300, sojasauce: 25, lauchzw: 1 }, 'Gemüse anbraten, Reis zugeben, Eier einrühren, mit Sojasoße und Frühlingszwiebeln abschmecken.');
  R('linsenreis', 'Linsen-Reis-Pfanne mit Röstzwiebeln', 30, 'reis', E, { tellerlinsen: 100, reis: 100, zwiebeln: 200, joghurt: 150 }, 'Linsen und Reis getrennt garen, Zwiebeln goldbraun braten, mischen und mit Joghurt servieren.');
  R('mujaddara', 'Mujaddara (Linsen-Reis) mit Joghurt', 35, 'reis', [], { tellerlinsen: 120, reis: 120, zwiebeln: 200, griechjoghurt: 150 }, 'Linsen halb garen, Reis zugeben und fertig garen. Mit gebräunten Zwiebeln und Joghurt servieren.');

  // Tofu, Soja & Veggie
  R('tofugeschnetzelt', 'Tofu-Geschnetzeltes mit Pilzen & Nudeln', 25, 'tofu', [], { tofu: 400, champignons: 250, kochsahne: 100, nudeln: 160, zwiebeln: 50 }, 'Tofu und Pilze anbraten, Kochcreme zugeben, mit Nudeln servieren.');
  R('tofukokoscurry', 'Tofu-Kokos-Curry mit Reis', 25, 'tofu', [], { tofu: 400, kokosmilch: 200, currypaste: 30, tkgemuese: 300, reis: 120 }, 'Tofu anbraten, Currypaste, Kokosmilch und Gemüse 10 Min köcheln. Reis separat kochen.');
  R('tofusuesssauer', 'Süß-saurer Tofu mit Paprika & Reis', 25, 'tofu', [], { tofu: 400, paprika: 2, zwiebeln: 100, sojasauce: 25, passata: 100, reis: 120 }, 'Tofu knusprig braten, Paprika und Zwiebel zugeben, mit Passata, Sojasoße und etwas Honig ablöschen. Reis dazu.');
  R('tofuteriyaki', 'Teriyaki-Tofu mit Brokkoli & Reis', 25, 'tofu', [], { tofu: 400, brokkoli: 300, sojasauce: 40, honig: 20, reis: 120, ingwer: 10 }, 'Tofu braten, Brokkoli dazu, mit Sojasoße, Honig und Ingwer glasieren. Reis separat kochen.');
  R('tofuwraps', 'Knusper-Tofu-Wraps mit Joghurtsoße', 20, 'wrap', E, { tofu: 400, wraps: 4, salat: 1, gurke: 1, joghurt: 100 }, 'Tofu in Streifen knusprig braten, mit Salat, Gurke und Joghurtsoße in Wraps rollen.');
  R('tofubolognese', 'Tofu-Bolognese mit Spaghetti', 25, 'tofu', E, { tofu: 400, nudeln: 200, passata: 500, zwiebeln: 100, karotten: 100 }, 'Tofu zerbröseln und kräftig anbraten, Gemüse und Passata zugeben, 15 Min köcheln. Nudeln kochen.');
  R('raeuchertofupfanne', 'Räuchertofu-Kartoffel-Pfanne', 25, 'tofu', E, { raeuchertofu: 200, kartoffeln: 500, paprika: 1, zwiebeln: 100, eier: 2 }, 'Kartoffelscheiben braten, Tofuwürfel, Paprika und Zwiebel zugeben, Spiegeleier darauf.');
  R('seitangulasch', 'Seitan-Gulasch mit Kartoffeln', 35, 'tofu', [], { seitan: 200, kartoffeln: 400, paprika: 2, zwiebeln: 150, tomatenmark: 20 }, 'Zwiebel, Paprika und Seitan anbraten, Tomatenmark, Paprikapulver und Kartoffelwürfel mit Wasser 20 Min schmoren.');
  R('seitanpfanne', 'Seitan-Gemüse-Pfanne mit Reis', 20, 'tofu', E, { seitan: 200, tkgemuese: 400, sojasauce: 25, reis: 120 }, 'Seitan in Streifen anbraten, Gemüse zugeben, mit Sojasoße würzen. Reis separat kochen.');
  R('veggieburgermenue', 'Veggie-Burger mit Ofenkartoffeln', 30, 'burger', [], { veggieburger: 2, burgerbroetchen: 2, pommes: 300, tomaten: 100, salat: 1 }, 'Pommes backen, Patties braten, Brötchen mit Salat, Tomate und Patty belegen.', OVEN);
  R('veggiewuerstchen', 'Veggie-Würstchen mit Kartoffelsalat', 30, 'kartoffel', E, { veggiewurst: 200, kartoffeln: 600, gurke: 1, joghurt: 100, zwiebeln: 50 }, 'Kartoffeln kochen, mit Gurke, Zwiebel und Joghurt-Dressing mischen. Würstchen braten.');
  R('sojaschnetzelcurry', 'Soja-Curry mit Erbsen & Reis', 25, 'tofu', [], { sojaschnetzel: 80, kokosmilch: 200, currypaste: 25, erbsen: 150, reis: 120 }, 'Sojaschnetzel quellen lassen und anbraten, Currypaste, Kokosmilch und Erbsen 10 Min köcheln. Reis dazu.');
  R('sojagulasch', 'Soja-Gulasch mit Nudeln', 30, 'tofu', [], { sojaschnetzel: 80, paprika: 2, zwiebeln: 150, passata: 300, nudeln: 160 }, 'Sojaschnetzel quellen lassen, mit Zwiebel und Paprika anbraten, Passata und Paprikapulver zugeben und 15 Min schmoren.');
  R('tofuschnitzel', 'Tofu-Schnitzel mit Kartoffelsalat', 35, 'tofu', [], { tofu: 400, mehl: 30, eier: 2, kartoffeln: 500, gurke: 1 }, 'Tofuscheiben in Mehl und Ei wenden, goldbraun braten. Kartoffelsalat mit Gurke separat anmachen.');
  R('tofuspiesse', 'Tofu-Gemüse-Spieße mit Couscous', 30, 'tofu', [], { tofu: 400, paprika: 2, zucchini: 300, couscous: 120 }, 'Tofu und Gemüse auf Spieße stecken, 20 Min bei 200 °C backen. Couscous quellen lassen.', OVENONLY);
  R('tofusalat', 'Asia-Tofu-Salat mit Erdnuss-Dressing', 20, 'salat', E, { tofu: 400, weisskohl: 200, karotten: 150, erdnussmus: 30, sojasauce: 25 }, 'Tofu braten, Kohl und Karotte hobeln, mit Erdnuss-Soja-Dressing mischen.');
  R('tofupad', 'Pad-Thai-Nudeln mit Tofu & Ei', 25, 'tofu', [], { reisnudeln: 200, tofu: 300, eier: 2, erdnussmus: 30, sojasauce: 30, lauchzw: 1 }, 'Tofu braten, Eier einrühren, gekochte Nudeln mit Erdnussmus und Sojasoße zugeben.');
  R('tofuspinatcurry', 'Spinat-Tofu-Curry (Palak Tofu)', 25, 'tofu', [], { tofu: 400, tkspinat: 300, kokosmilch: 100, zwiebeln: 100, reis: 120 }, 'Zwiebel anbraten, Spinat und Kokosmilch zugeben, Tofuwürfel darin erwärmen. Reis dazu.');

  // Linsen, Bohnen, Kichererbsen
  R('linsencurry', 'Linsen-Kokos-Curry mit Süßkartoffel', 30, 'linsen', [], { linsen: 150, kokosmilch: 200, suesskart: 300, currypaste: 20, reis: 100 }, 'Süßkartoffel anbraten, Linsen, Currypaste und Kokosmilch mit 300 ml Wasser 20 Min köcheln. Reis dazu.');
  R('linsenburger', 'Linsen-Burger mit Joghurtsoße', 35, 'burger', [], { tellerlinsen: 120, haferflocken: 60, eier: 2, burgerbroetchen: 2, joghurt: 100, tomaten: 100 }, 'Gekochte Linsen mit Haferflocken und Ei zu Patties formen, braten, im Brötchen mit Tomate und Joghurt servieren.');
  R('linsensalatfeta', 'Linsen-Salat mit Roter Bete & Ziegenkäse', 15, 'salat', E, { linsendose: 500, rotebeete: 250, ziegenkaese: 80, rucola: 50 }, 'Linsen abspülen, mit Rote-Bete-Würfeln und Rucola mischen, Ziegenkäse darüber.', NONE);
  R('linsenshepherd', 'Linsen-Kartoffel-Auflauf (Shepherd\'s Pie)', 50, 'ofen', [], { tellerlinsen: 120, kartoffeln: 600, karotten: 150, erbsen: 100, passata: 200, reibekaese: 50 }, 'Linsen mit Karotte, Erbsen und Passata köcheln, Kartoffelpüree darauf, Käse darüber, 20 Min bei 200 °C überbacken.', OVEN);
  R('dalfenchel', 'Gelbes Dal mit Spinat', 25, 'linsen', [], { linsen: 160, tkspinat: 200, zwiebeln: 100, joghurt: 100, reis: 100 }, 'Zwiebel mit Kurkuma anbraten, Linsen und 500 ml Wasser 15 Min garen, Spinat unterheben. Reis und Joghurt dazu.');
  R('kichererbsenpfanne', 'Kichererbsen-Tomaten-Pfanne mit Ei', 20, 'bohnen', E, { kichererbsen: 480, dosentom: 400, eier: 3, zwiebeln: 100 }, 'Zwiebel anbraten, Tomaten und Kichererbsen köcheln, Eier darin stocken lassen.');
  R('kichererbsenburger', 'Kichererbsen-Frikadellen mit Tzatziki', 30, 'bohnen', [], { kichererbsen: 480, eier: 2, haferflocken: 50, zwiebeln: 50, tzatziki: 150, pita: 4 }, 'Kichererbsen zerdrücken, mit Ei, Haferflocken und Zwiebel formen, braten. Mit Tzatziki in Pita.');
  R('kichererbsensalat', 'Kichererbsen-Gurken-Salat mit Feta', 10, 'salat', E, { kichererbsen: 480, gurke: 1, tomaten: 250, feta: 100, oliven: 40 }, 'Alles würfeln und mischen.', NONE);
  R('bohneneintopfpaprika', 'Bohnen-Paprika-Topf mit Ei', 25, 'bohnen', T, { wbohnen: 480, paprika: 2, passata: 300, zwiebeln: 100, eier: 2 }, 'Gemüse anbraten, Passata und Bohnen köcheln, Eier darin pochieren.');
  R('schwarzebohnensuppe', 'Schwarze-Bohnen-Suppe mit Skyr', 25, 'bohnen', T, { sbohnen: 480, dosentom: 200, mais: 100, zwiebeln: 100, skyr: 100 }, 'Zwiebel anbraten, Bohnen, Tomaten und Mais mit 300 ml Wasser köcheln, Skyr als Klecks.');
  R('hummusbowl', 'Hummus-Bowl mit Ofengemüse & Ei', 30, 'bowl', [], { hummus: 150, suesskart: 300, paprika: 1, eier: 4, spinat: 60 }, 'Süßkartoffel und Paprika 25 Min bei 200 °C rösten, mit Hummus, Spinat und gekochtem Ei anrichten.', OVENONLY);
  R('falafelwrap', 'Falafel-Wraps mit Hummus', 15, 'wrap', E, { falafel: 230, wraps: 4, hummus: 100, gurke: 1, tomaten: 150 }, 'Falafel erwärmen, mit Hummus und Gemüse in Wraps rollen.');
  R('bohnenburrito', 'Bohnen-Reis-Burritos', 20, 'wrap', E, { wraps: 4, sbohnen: 240, reis: 100, mais: 100, reibekaese: 60 }, 'Reis, Bohnen und Mais erwärmen, mit Käse in Wraps füllen, kurz anbraten.');
  R('baked-beans', 'Baked Beans mit Spiegelei', 25, 'bohnen', E, { wbohnen: 480, passata: 300, eier: 4, toast: 100, zwiebeln: 50 }, 'Zwiebel anbraten, Bohnen und Passata 10 Min köcheln, Spiegeleier und Toast dazu.');
  R('linsendahl-tomate', 'Tomaten-Dal mit Joghurt', 25, 'linsen', [], { linsen: 150, passata: 300, zwiebeln: 100, joghurt: 100, brot: 100 }, 'Zwiebel anbraten, Linsen, Passata und 400 ml Wasser 15 Min garen, Joghurt und Brot dazu.');
  R('kichererbsen-spinat-curry', 'Kichererbsen-Spinat-Curry (Chana Palak)', 25, 'bohnen', [], { kichererbsen: 480, tkspinat: 250, dosentom: 200, zwiebeln: 100, reis: 100 }, 'Zwiebel anbraten, Tomaten und Spinat zugeben, Kichererbsen 10 Min köcheln. Reis dazu.');
  R('sojabohnenpfanne', 'Edamame-Bohnen-Pfanne mit Ei', 15, 'bohnen', E, { edamame: 250, sbohnen: 240, eier: 3, sojasauce: 20, lauchzw: 1 }, 'Edamame und Bohnen anbraten, Eier einrühren, mit Sojasoße abschmecken.');
  R('kidneyreis', 'Kidneybohnen-Reis mit Paprika', 25, 'reis', E, { kidney: 240, reis: 140, paprika: 2, mais: 100, skyr: 100 }, 'Paprika anbraten, Bohnen, Mais und gekochten Reis zugeben, Skyr dazu.');
  R('linsenbowl', 'Linsen-Bowl mit Joghurt & Ofengemüse', 30, 'bowl', [], { tellerlinsen: 120, zucchini: 300, paprika: 1, griechjoghurt: 150, feta: 60 }, 'Linsen kochen, Gemüse 20 Min bei 200 °C rösten, mit Joghurt und Feta anrichten.', OVEN);
  R('bohnenquesadilla', 'Quesadilla mit Kidney & Mais', 15, 'wrap', E, { wraps: 4, kidney: 240, mais: 100, reibekaese: 80, tomaten: 100 }, 'Bohnen zerdrücken, mit Mais und Käse in Wraps füllen, beidseitig braten.');
  R('hummuspasta', 'Cremige Hummus-Nudeln mit Tomaten', 15, 'pasta', E, { nudeln: 200, hummus: 150, tomaten: 250, spinat: 80 }, 'Nudeln kochen, mit Hummus und etwas Nudelwasser verrühren, Tomaten und Spinat unterheben.');

  // Kartoffeln & Süßkartoffeln
  R('ofenkartoffelquark', 'Ofenkartoffeln mit Kräuterquark', 45, 'kartoffel', E, { kartoffeln: 700, quark: 300, lauchzw: 1, eier: 2 }, 'Kartoffeln 35 Min bei 200 °C backen, Quark mit Frühlingszwiebeln verrühren, Eier dazu kochen.', OVENONLY);
  R('kartoffelpuffer', 'Kartoffelpuffer mit Quark & Apfelmus', 35, 'kartoffel', [], { kartoffeln: 600, eier: 2, mehl: 30, quark: 250, aepfel: 200 }, 'Kartoffeln reiben, mit Ei und Mehl mischen, Puffer goldbraun braten. Quark und Apfelmus dazu.');
  R('kartoffelcurry', 'Kartoffel-Erbsen-Curry', 30, 'kartoffel', [], { kartoffeln: 500, erbsen: 200, kokosmilch: 200, currypaste: 20, tofu: 200 }, 'Kartoffelwürfel mit Currypaste anbraten, Kokosmilch und 100 ml Wasser zugeben, 15 Min garen, Erbsen und Tofu unterheben.');
  R('suesskartoffelcurry', 'Süßkartoffel-Kichererbsen-Curry', 30, 'kartoffel', [], { suesskart: 500, kichererbsen: 480, kokosmilch: 200, currypaste: 20, spinat: 100 }, 'Süßkartoffelwürfel anbraten, Kokosmilch, Currypaste und Kichererbsen 15 Min köcheln, Spinat zum Schluss.');
  R('gefuelltekartoffel', 'Gefüllte Ofenkartoffeln mit Bohnen & Käse', 50, 'kartoffel', [], { kartoffeln: 700, kidney: 240, reibekaese: 80, skyr: 100 }, 'Kartoffeln 40 Min backen, aushöhlen, mit Bohnen und Käse füllen und überbacken. Skyr dazu.', OVENONLY);
  R('kartoffelspinatkaese', 'Kartoffel-Spinat-Auflauf mit Feta', 45, 'ofen', [], { kartoffeln: 600, tkspinat: 250, feta: 150, eier: 2, milch: 100 }, 'Kartoffelscheiben und Spinat schichten, Eier-Milch-Mischung und Feta darüber, 30 Min bei 190 °C backen.', OVENONLY);
  R('rostiei', 'Rösti mit Spiegelei & Spinat', 30, 'kartoffel', [], { kartoffeln: 600, eier: 4, spinat: 100, frischkaese: 60 }, 'Kartoffeln raspeln, zu Rösti braten, mit Spinat, Frischkäse und Spiegelei servieren.');
  R('suesskartoffelpommes', 'Süßkartoffel-Pommes mit Quark-Dip & Ei', 35, 'kartoffel', E, { suesskart: 600, quark: 250, eier: 2, rucola: 40 }, 'Süßkartoffelstifte 25 Min bei 220 °C backen, Quark als Dip, Eier dazu.', OVENONLY);
  R('kartoffelgnocchipfanne', 'Kartoffel-Linsen-Pfanne', 25, 'kartoffel', E, { kartoffeln: 500, linsendose: 500, zwiebeln: 100, joghurt: 150 }, 'Kartoffelwürfel braten, Linsen und Zwiebel zugeben, Joghurt dazu.');
  R('puereepilz', 'Kartoffelpüree mit Pilzragout & Ei', 30, 'kartoffel', [], { kartoffeln: 500, champignons: 300, eier: 2, kochsahne: 80, milch: 100 }, 'Kartoffeln kochen und mit Milch stampfen. Pilze mit Kochcreme anbraten, mit gekochtem Ei servieren.');
  R('wedgesfeta', 'Kartoffelecken mit Feta & Tzatziki', 30, 'kartoffel', E, { pommes: 500, feta: 100, tzatziki: 150, tomaten: 150 }, 'Kartoffelecken backen, mit Feta, Tomatenwürfeln und Tzatziki anrichten.', OVENONLY);
  R('bratkartoffeltofu', 'Bratkartoffeln mit Räuchertofu & Spinat', 30, 'kartoffel', E, { kartoffeln: 600, raeuchertofu: 200, tkspinat: 150, zwiebeln: 100 }, 'Kartoffelscheiben braten, Tofu, Zwiebel und Spinat zugeben.');

  // Ofen & Aufläufe
  R('ofenfeta', 'Ofen-Feta mit Tomaten & Nudeln', 30, 'ofen', E, { feta: 200, tomaten: 400, nudeln: 160, rucola: 40 }, 'Feta mit Tomaten 20 Min bei 200 °C backen, zerdrücken und mit Nudeln mischen.', OVEN);
  R('ofengemuesehalloumi', 'Halloumi mit Ofengemüse & Kartoffeln', 40, 'ofen', [], { halloumi: 200, kartoffeln: 400, zucchini: 300, paprika: 1, joghurt: 100 }, 'Gemüse und Kartoffeln 30 Min bei 200 °C rösten, Halloumi die letzten 10 Min dazu, mit Joghurt.', OVENONLY);
  R('blumenkohlauflauf', 'Blumenkohl-Käse-Auflauf', 40, 'ofen', [], { blumenkohl: 1, eier: 3, kochsahne: 100, reibekaese: 100, kartoffeln: 300 }, 'Blumenkohl und Kartoffeln vorkochen, in eine Form geben, Ei-Sahne-Mischung und Käse darüber, 25 Min bei 200 °C backen.', OVENONLY);
  R('brokkoliauflauf', 'Brokkoli-Nudel-Auflauf mit Quark', 40, 'ofen', [], { nudeln: 160, brokkoli: 400, quark: 250, eier: 2, reibekaese: 80 }, 'Nudeln und Brokkoli vorgaren, mit Quark-Ei-Mischung in eine Form, Käse darüber, 25 Min bei 190 °C backen.', OVENONLY);
  R('zucchinipuffer', 'Zucchini-Feta-Puffer mit Joghurt', 30, 'ei', E, { zucchini: 500, eier: 3, feta: 100, mehl: 40, joghurt: 150 }, 'Zucchini raspeln und ausdrücken, mit Ei, Feta und Mehl mischen, Puffer braten.');
  R('auberginenlinsen', 'Gefüllte Aubergine mit Linsen & Feta', 45, 'ofen', [], { aubergine: 2, tellerlinsen: 100, feta: 100, passata: 200, zwiebeln: 50 }, 'Aubergine halbieren und aushöhlen, mit Linsen-Tomaten-Mischung füllen, Feta darüber, 30 Min bei 200 °C backen.', OVENONLY);
  R('ratatouille', 'Ratatouille mit Ei & Brot', 35, 'ofen', [], { zucchini: 300, aubergine: 1, paprika: 2, dosentom: 400, eier: 3, baguette: 1 }, 'Gemüse anbraten, mit Tomaten 20 Min schmoren, Eier darin stocken lassen, Baguette dazu.');
  R('kohlrabigratin', 'Kohlrabi-Kartoffel-Gratin', 50, 'ofen', [], { kohlrabi: 2, kartoffeln: 400, kochsahne: 100, reibekaese: 80, eier: 2 }, 'Scheiben schichten, Sahne-Ei-Mischung und Käse darüber, 35 Min bei 190 °C backen.', OVENONLY);
  R('spinatquiche', 'Spinat-Feta-Quiche', 50, 'ofen', [], { blaetterteig: 275, tkspinat: 250, eier: 4, feta: 100, quark: 100 }, 'Teig in eine Form legen, Spinat-Ei-Feta-Quark-Mischung einfüllen, 30 Min bei 190 °C backen.', OVENONLY);
  R('gemuesetarte', 'Tomaten-Ziegenkäse-Tarte', 35, 'ofen', [], { blaetterteig: 275, tomaten: 300, ziegenkaese: 125, eier: 2, rucola: 40 }, 'Teig mit Tomaten und Ziegenkäse belegen, Eier darüber verteilen, 25 Min bei 200 °C backen.', OVENONLY);
  R('rosenkohlpfanne', 'Rosenkohl-Kartoffel-Pfanne mit Halloumi', 30, 'kaese', [], { rosenkohl: 400, kartoffeln: 400, halloumi: 200 }, 'Kartoffelwürfel braten, Rosenkohl und Halloumi zugeben, gut bräunen.');
  R('kuerbisfeta', 'Ofenkürbis mit Feta & Linsen', 40, 'ofen', [], { kuerbis: 600, feta: 100, tellerlinsen: 100, rucola: 40 }, 'Kürbis 25 Min bei 200 °C rösten, mit gekochten Linsen, Feta und Rucola anrichten.', OVEN);
  R('rotebeeteofen', 'Rote-Bete-Ofengemüse mit Ziegenkäse', 45, 'ofen', [], { rotebeete: 400, kartoffeln: 400, ziegenkaese: 125, walnuss: 30 }, 'Rote Bete und Kartoffeln 30 Min bei 200 °C rösten, Ziegenkäse und Walnüsse darüber.', OVENONLY);
  R('pilzofenreis', 'Pilz-Spinat-Auflauf mit Reis', 40, 'ofen', [], { reis: 120, champignons: 300, tkspinat: 200, eier: 2, reibekaese: 80 }, 'Gekochten Reis mit Pilzen, Spinat und Ei mischen, Käse darüber, 20 Min bei 200 °C backen.', OVENONLY);

  // Bowls & Salate
  R('buddhabowl', 'Buddha-Bowl mit Tofu & Süßkartoffel', 35, 'bowl', [], { tofu: 300, suesskart: 400, quinoa: 80, spinat: 80, tahini: 20 }, 'Süßkartoffel rösten, Tofu braten, Quinoa kochen, mit Spinat und Tahini-Dressing anrichten.', OVEN);
  R('mediterranbowl', 'Mediterrane Bowl mit Falafel', 20, 'bowl', E, { falafel: 230, couscous: 100, oliven: 40, tomaten: 200, gurke: 1, hummus: 100 }, 'Couscous quellen lassen, Falafel erwärmen, mit Gemüse, Oliven und Hummus anrichten.');
  R('linsenbowlasia', 'Reis-Bowl mit Tofu & Gurke', 25, 'bowl', E, { reis: 140, tofu: 300, gurke: 1, karotten: 100, edamame: 150, sojasauce: 25 }, 'Reis kochen, Tofu braten, Edamame garen, mit Gemüse und Sojasoße anrichten.');
  R('griechischersalat', 'Griechischer Salat mit Kichererbsen', 10, 'salat', E, { tomaten: 300, gurke: 1, feta: 150, oliven: 40, kichererbsen: 250 }, 'Gemüse würfeln, mit Feta, Oliven und Kichererbsen mischen.', NONE);
  R('rucolasalatwalnuss', 'Rucola-Salat mit Ziegenkäse & Walnüssen', 10, 'salat', E, { rucola: 100, ziegenkaese: 125, walnuss: 30, brot: 150, eier: 2 }, 'Rucola mit Walnüssen und Ziegenkäse anrichten, Ei und Brot dazu.', NONE);
  R('linsensalatorient', 'Orientalischer Linsen-Couscous-Salat', 15, 'salat', E, { linsendose: 250, couscous: 80, gurke: 1, tomaten: 150, feta: 100 }, 'Couscous quellen lassen, mit allen Zutaten mischen.', NONE);
  R('coleslaw', 'Krautsalat-Bowl mit Bohnen & Joghurt', 15, 'salat', E, { weisskohl: 300, karotten: 150, sbohnen: 240, edamame: 150, griechjoghurt: 100, mais: 100 }, 'Kohl und Karotte fein hobeln, mit Bohnen, Mais und Joghurt vermengen.', NONE);
  R('bohnentomatensalat', 'Weiße-Bohnen-Salat mit Tomaten & Feta', 10, 'salat', E, { wbohnen: 480, tomaten: 250, feta: 100, lauchzw: 1 }, 'Alles mischen, mit Essig und Öl abschmecken.', NONE);
  R('caesarveg', 'Veggie-Caesar-Salat mit Ei & Kichererbsen', 20, 'salat', E, { salat: 2, eier: 3, kichererbsen: 250, parmesan: 30, brot: 100, joghurt: 100 }, 'Kichererbsen und Brotwürfel rösten, mit Salat, Ei, Parmesan und Joghurt-Dressing anrichten.');
  R('wintersalat', 'Rote-Bete-Salat mit Feta & Linsen', 10, 'salat', E, { rotebeete: 300, tellerlinsen: 80, feta: 100, walnuss: 20, rucola: 40 }, 'Linsen kochen, mit Rote Bete, Rucola und Feta mischen, Walnüsse darüber.');
  R('eiersalatbowl', 'Avocado-Ei-Bowl mit Reis', 20, 'bowl', E, { reis: 120, eier: 3, avocado: 1, edamame: 150, sojasauce: 20 }, 'Reis und Edamame garen, mit Ei und Avocado anrichten.');
  R('rotkohlsalat', 'Rotkohl-Apfel-Salat mit Ziegenkäse', 15, 'salat', E, { rotkohl: 300, aepfel: 200, ziegenkaese: 100, walnuss: 20, kichererbsen: 250 }, 'Kohl fein hobeln, mit Apfel, Kichererbsen und Ziegenkäse mischen.', NONE);
  R('thaisalat', 'Thai-Nudelsalat mit Edamame', 20, 'salat', E, { reisnudeln: 150, edamame: 200, gurke: 1, karotten: 100, erdnussmus: 30, sojasauce: 25 }, 'Nudeln kochen, mit Gemüse und Erdnuss-Soja-Dressing mischen.', NONE);
  R('tabouleh', 'Tabouleh mit Hummus & Feta', 20, 'salat', E, { bulgur: 100, tomaten: 250, gurke: 1, feta: 100, hummus: 100 }, 'Bulgur quellen lassen, mit Gemüse mischen, Hummus und Feta dazu.', NONE);

  // Wraps, Brot, Burger, Pizza, Flammkuchen
  R('flammkuchen', 'Flammkuchen mit Frischkäse & Lauch', 25, 'pizza', [], { pizzateig: 400, frischkaese: 150, lauch: 1, zwiebeln: 100, reibekaese: 60 }, 'Teig dünn ausrollen, mit Frischkäse, Lauch und Zwiebel belegen, 15 Min bei 230 °C backen.', OVENONLY);
  R('pizzagemuese', 'Gemüse-Pizza mit Mozzarella', 30, 'pizza', [], { pizzateig: 400, passata: 150, mozzarella: 250, zucchini: 150, paprika: 1 }, 'Teig mit Passata und Gemüse belegen, Mozzarella darauf, 15 Min bei 230 °C backen.', OVENONLY);
  R('pizzaspinat', 'Spinat-Ricotta-Pizza', 30, 'pizza', [], { pizzateig: 400, ricotta: 250, tkspinat: 150, passata: 100, mozzarella: 125 }, 'Teig mit Passata, Spinat und Ricotta belegen, Mozzarella darauf, 15 Min bei 230 °C backen.', OVENONLY);
  R('pizzataschen', 'Pizza-Taschen mit Gemüse & Käse', 35, 'pizza', [], { pizzateig: 400, reibekaese: 100, paprika: 1, mais: 100, passata: 100 }, 'Teig in Quadrate schneiden, füllen, zuklappen, 18 Min bei 200 °C backen.', OVENONLY);
  R('burgerlinsen', 'Bohnen-Burger mit Avocado', 30, 'burger', [], { kidney: 240, haferflocken: 60, eier: 1, burgerbroetchen: 2, avocado: 1, tomaten: 100 }, 'Bohnen zerdrücken, mit Haferflocken und Ei formen, braten, im Brötchen mit Avocado und Tomate.');
  R('halloumiburger', 'Halloumi-Burger mit Tomate & Rucola', 20, 'burger', E, { halloumi: 200, burgerbroetchen: 2, tomaten: 100, rucola: 30, joghurt: 50 }, 'Halloumi braten, im Brötchen mit Tomate, Rucola und Joghurtsoße servieren.');
  R('tofuburger', 'Tofu-Burger mit Röstzwiebeln', 25, 'burger', [], { tofu: 400, burgerbroetchen: 2, zwiebeln: 150, salat: 1, ajvar: 40 }, 'Tofuscheiben braten, Zwiebeln rösten, im Brötchen mit Salat und Ajvar.');
  R('pitahalloumi', 'Pita mit Halloumi & Tzatziki', 15, 'wrap', E, { pita: 4, halloumi: 200, tzatziki: 125, tomaten: 150, gurke: 1 }, 'Halloumi braten, Pita füllen mit Halloumi, Gemüse und Tzatziki.');
  R('wrapsavocadoei', 'Avocado-Ei-Wraps', 15, 'wrap', E, { wraps: 4, eier: 4, avocado: 1, tomaten: 100, salat: 1 }, 'Eier kochen, mit Avocado und Gemüse in Wraps rollen.', NONE);
  R('wrapskichererbse', 'Kichererbsen-Wraps mit Joghurtsoße', 15, 'wrap', E, { wraps: 4, kichererbsen: 250, griechjoghurt: 100, gurke: 1, tomaten: 100 }, 'Kichererbsen leicht zerdrücken und würzen, mit Gemüse und Joghurt in Wraps rollen.', NONE);
  R('ofenbaguette', 'Überbackenes Baguette mit Mozzarella & Tomate', 20, 'pizza', E, { baguette: 2, mozzarella: 250, tomaten: 250, pesto: 30 }, 'Baguette halbieren, mit Pesto, Tomate und Mozzarella belegen, 10 Min bei 200 °C überbacken.', OVENONLY);
  R('brotaufstrich', 'Belegte Brote mit Hummus, Ei & Rohkost', 10, 'dip', E, { brot: 200, hummus: 100, eier: 3, gurke: 1, karotten: 100 }, 'Brote mit Hummus bestreichen, mit Ei und Gemüse belegen.', NONE);
  R('toastkaeseavocado', 'Käse-Gemüse-Toast überbacken', 15, 'pizza', E, { toast: 200, reibekaese: 100, tomaten: 150, eier: 2, spinat: 50 }, 'Toast mit Tomate, Spinat, Käse und Ei belegen, 10 Min bei 200 °C überbacken.', OVENONLY);
  R('gemuesestrudel', 'Gemüse-Käse-Strudel', 40, 'ofen', [], { blaetterteig: 275, tkgemuese: 300, feta: 100, quark: 100, eier: 1 }, 'Teig mit Gemüse, Feta und Quark füllen, einrollen, mit Ei bestreichen, 25 Min bei 200 °C backen.', OVENONLY);
  R('pitafalafel2', 'Gefüllte Pita mit Bohnen & Feta', 15, 'wrap', E, { pita: 4, wbohnen: 240, feta: 100, tomaten: 150, rucola: 30 }, 'Bohnen zerdrücken, Pita füllen mit Bohnen, Feta, Tomate und Rucola.', NONE);
  R('flammkuchenziege', 'Flammkuchen mit Ziegenkäse & Rote Bete', 25, 'pizza', [], { pizzateig: 400, ziegenkaese: 125, rotebeete: 150, zwiebeln: 100, walnuss: 20 }, 'Teig mit Ziegenkäse, Rote-Bete-Scheiben und Zwiebel belegen, 15 Min bei 230 °C backen.', OVENONLY);

  // Käse-Gerichte
  R('halloumigemuese', 'Halloumi-Gemüse-Pfanne mit Couscous', 25, 'kaese', E, { halloumi: 200, zucchini: 300, paprika: 1, couscous: 100 }, 'Halloumi und Gemüse anbraten, Couscous quellen lassen, mischen.');
  R('halloumicurry', 'Halloumi-Curry mit Reis', 25, 'kaese', [], { halloumi: 200, kokosmilch: 200, currypaste: 20, tkgemuese: 300, reis: 100 }, 'Halloumi anbraten, Currypaste, Kokosmilch und Gemüse köcheln, Reis dazu.');
  R('camembertofen', 'Ofen-Camembert mit Kartoffeln & Salat', 35, 'kaese', [], { camembert: 125, kartoffeln: 500, salat: 1, tomaten: 150, quark: 100 }, 'Kartoffeln kochen, Camembert 12 Min bei 200 °C backen, mit Salat und Quark servieren.', OVEN);
  R('fetapaprika', 'Feta-Paprika-Pfanne mit Ei', 20, 'kaese', E, { feta: 150, paprika: 2, eier: 4, zwiebeln: 100, brot: 100 }, 'Paprika und Zwiebel anbraten, Feta und Eier zugeben, stocken lassen.');
  R('ziegenkaesesalat', 'Gebackener Ziegenkäse auf Linsensalat', 25, 'kaese', [], { ziegenkaese: 125, linsendose: 250, rucola: 60, tomaten: 150, baguette: 1 }, 'Ziegenkäse auf Baguette 8 Min bei 200 °C überbacken, auf Linsensalat setzen.', OVENONLY);
  R('mozzarellaauflauf', 'Mozzarella-Tomaten-Auflauf mit Gnocchi', 30, 'ofen', E, { gnocchi: 400, mozzarella: 250, tomaten: 250, spinat: 100 }, 'Alles in eine Form schichten, 20 Min bei 200 °C backen.', OVENONLY);
  R('kaesepilzpfanne', 'Käse-Pilz-Pfanne mit Spätzle', 20, 'kaese', E, { spaetzle: 400, champignons: 250, reibekaese: 80, quark: 100 }, 'Pilze anbraten, Spätzle zugeben, Käse und Quark unterrühren.');
  R('feta-ofengemuese-bulgur', 'Feta-Ofengemüse mit Bulgur', 35, 'kaese', [], { feta: 200, bulgur: 120, aubergine: 1, paprika: 1, tomaten: 200 }, 'Gemüse 25 Min bei 200 °C rösten, Feta in den letzten 10 Min dazu, Bulgur quellen lassen.', OVENONLY);
  R('kaeseknoedel', 'Quark-Käse-Bällchen mit Tomatensoße', 30, 'quark', [], { quark: 250, mehl: 60, eier: 2, reibekaese: 80, passata: 300 }, 'Quark, Mehl, Ei und Käse zu Bällchen formen, in Salzwasser gar ziehen, mit Tomatensoße servieren.');
  R('ricottagnocchi', 'Ricotta-Spinat-Bällchen mit Tomatensoße', 30, 'quark', [], { ricotta: 250, tkspinat: 150, mehl: 50, eier: 1, passata: 300, parmesan: 20 }, 'Ricotta, Spinat, Mehl und Ei mischen, kleine Klöße formen, 5 Min gar ziehen, mit Passata servieren.');

  // Quark, Skyr, Süßes (auch als Mahlzeit)
  R('quarkpancakes', 'Protein-Pancakes mit Quark & Beeren', 20, 'suess', [], { haferflocken: 100, quark: 250, eier: 3, beeren: 150, honig: 15 }, 'Haferflocken, Quark und Eier verrühren, kleine Pancakes backen, mit Beeren und Honig servieren.');
  R('overnightoats', 'Overnight Oats mit Quark & Beeren', 5, 'suess', E, { haferflocken: 100, milch: 200, quark: 200, beeren: 150, chia: 20 }, 'Abends Haferflocken, Milch, Quark und Chia mischen, im Kühlschrank quellen lassen, morgens Beeren darauf.', NONE);
  R('skyrbowl', 'Skyr-Bowl mit Müsli, Banane & Nüssen', 5, 'suess', E, { skyr: 400, muesli: 80, banane: 2, walnuss: 20 }, 'Alles in Schalen schichten.', NONE);
  R('griesbrei', 'Haferbrei mit Apfel, Zimt & Quark', 15, 'suess', E, { haferflocken: 100, milch: 300, aepfel: 200, quark: 200 }, 'Haferflocken mit Milch aufkochen, Apfelstücke zugeben, Quark unterrühren.');
  R('quarkauflauf', 'Süßer Quark-Auflauf mit Aprikosen', 45, 'suess', [], { quark: 500, eier: 3, haferflocken: 50, aprikosen: 60, honig: 20 }, 'Alles verrühren, in eine Form füllen, 35 Min bei 180 °C backen.', OVENONLY);
  R('quarkknoedel', 'Quark-Pfannkuchen mit Mango', 25, 'suess', [], { mehl: 100, eier: 3, quark: 250, milch: 200, mango: 200 }, 'Pfannkuchen backen, mit Quark und aufgetauter Mango füllen.');
  
  R('porridgekakao', 'Kakao-Porridge mit Quark & Banane', 10, 'suess', E, { haferflocken: 100, milch: 300, kakao: 15, banane: 2, quark: 150 }, 'Haferflocken mit Milch und Kakao aufkochen, Banane und Quark unterrühren.');

  R('cashewtofu', 'Cashew-Tofu-Pfanne mit Reis', 25, 'tofu', [], { tofu: 300, cashew: 40, tkgemuese: 300, sojasauce: 25, reis: 120 }, 'Tofu knusprig braten, Cashews kurz mitrösten, Gemüse zugeben, mit Sojasoße abschmecken. Reis separat kochen.');
  R('artischockenpasta', 'Pasta mit Artischocken, Ricotta & Tomaten', 20, 'pasta', E, { nudeln: 200, artischocken: 240, ricotta: 250, tomaten: 150 }, 'Nudeln kochen, Artischocken und Tomaten kurz anbraten, Ricotta unterrühren und alles mischen.');
  R('artischockenflamm', 'Flammkuchen mit Artischocken, Feta & Oliven', 25, 'pizza', [], { pizzateig: 400, artischocken: 120, feta: 100, oliven: 40, reibekaese: 50 }, 'Teig belegen und 15 Min bei 230 °C backen.', OVENONLY);
  R('haferproteinporridge', 'Protein-Porridge mit Haferdrink & Leinsamen', 10, 'suess', E, { haferflocken: 100, hafermilch: 300, skyr: 200, banane: 1, leinsamen: 15 }, 'Haferflocken im Haferdrink aufkochen, Banane zerdrücken, mit Skyr und Leinsamen servieren.');

  // --- Snacks (1 Portion) ---
  const S = { type: 'snack', serv: 1 }, SN = Object.assign({ tools: [] }, S), SH = Object.assign({ tools: ['herd'] }, S);
  R('s-leinsamenquark', 'Quark mit Leinsamen & Beeren', 3, 'snack', E, { quark: 200, leinsamen: 10, beeren: 80 }, 'Alles verrühren.', SN);
  R('s-cashewskyr', 'Skyr mit Cashews & Aprikosen', 3, 'snack', E, { skyr: 250, cashew: 15, aprikosen: 30 }, 'Alles mischen.', SN);
  R('s-chiapudding', 'Chia-Pudding mit Skyr & Mango', 5, 'snack', E, { chia: 20, sojadrink: 150, skyr: 200, mango: 100 }, 'Chia in Sojadrink quellen lassen (mind. 2 Std), mit Skyr und Mango schichten.', SN);
  R('s-skyrmango', 'Skyr mit Mango & Chia', 3, 'snack', E, { skyr: 250, mango: 100, chia: 10 }, 'Alles in einer Schale mischen.', SN);
  R('s-quarkapfel', 'Apfel-Zimt-Quark', 3, 'snack', E, { quark: 200, aepfel: 150, honig: 10 }, 'Apfel raspeln, mit Quark und Zimt mischen.', SN);
  R('s-eiavocado', 'Avocado-Ei-Toast', 8, 'snack', E, { toast: 60, avocado: 0.5, eier: 1 }, 'Toast mit Avocado und Ei belegen.', SH);
  R('s-hummusbrot', 'Hummus-Brot mit Gurke', 3, 'snack', D, { brot: 80, hummus: 60, gurke: 0.5 }, 'Brot bestreichen und belegen.', SN);
  R('s-tzatzikigemuese', 'Tzatziki mit Gemüsesticks', 4, 'snack', D, { tzatziki: 100, karotten: 100, paprika: 0.5, gurke: 0.5 }, 'Gemüse in Sticks schneiden, dippen.', SN);
  R('s-ziegenkaeseknaecke', 'Knäckebrot mit Ziegenfrischkäse & Rote Bete', 4, 'snack', E, { knaecke: 40, ziegenkaese: 40, rotebeete: 60 }, 'Knäckebrot bestreichen und belegen.', SN);
  R('s-oliventomate', 'Tomate-Mozzarella-Spieße', 5, 'snack', E, { mozzarella: 125, tomaten: 150, oliven: 20 }, 'Auf Spieße stecken.', SN);
  R('s-kichererbsenrost', 'Geröstete Kichererbsen', 25, 'snack', [], { kichererbsen: 250, sonnenblumenkerne: 10 }, 'Kichererbsen trocknen, mit Gewürzen 20 Min bei 200 °C backen.', Object.assign({ tools: ['backofen'] }, S));
  R('s-reiswaffelavo', 'Reiswaffeln mit Avocado & Ei', 5, 'snack', E, { reiswaffeln: 30, avocado: 0.5, eier: 1 }, 'Ei kochen, mit Avocado auf Reiswaffeln legen.', SH);
  R('s-magerquarkdip', 'Kräuterquark mit Brot', 3, 'snack', D, { quark: 150, brot: 60, gurke: 0.5 }, 'Quark mit Kräutern und Salz würzen, mit Brot und Gurke essen.', SN);
  R('s-bananenskyr', 'Bananen-Skyr-Shake zum Löffeln', 3, 'snack', E, { skyr: 200, banane: 1, haferflocken: 20 }, 'Banane zerdrücken, mit Skyr und Haferflocken mischen.', SN);
  R('s-edamamesalat', 'Edamame-Salat mit Mais', 8, 'snack', E, { edamame: 150, mais: 60, tomaten: 80 }, 'Edamame garen, mit Mais und Tomate mischen.', SH);
  R('s-feta', 'Feta mit Gurke & Oliven', 3, 'snack', E, { feta: 80, gurke: 0.5, oliven: 20 }, 'Alles würfeln und mischen.', SN);
  R('s-proteinbrei', 'Haferflocken-Quark-Brei mit Beeren', 5, 'snack', E, { haferflocken: 40, quark: 150, beeren: 80 }, 'Haferflocken mit Wasser quellen lassen, mit Quark und Beeren mischen.', SN);
  R('s-sojajoghurt', 'Sojajoghurt mit Nüssen & Aprikosen', 3, 'snack', E, { sojajoghurt: 250, mandeln: 15, aprikosen: 30 }, 'Alles mischen.', SN);
  R('s-eierkaese', 'Hartgekochte Eier mit Käsewürfeln', 10, 'snack', E, { eier: 2, gouda: 30 }, 'Eier 9 Min kochen, mit Käse essen.', SH);
  R('s-kakaoquark', 'Kakao-Quark mit Banane', 4, 'snack', E, { quark: 200, kakao: 8, banane: 0.5, honig: 10 }, 'Quark mit Kakao und Honig glatt rühren, Banane darauf.', SN);
  R('s-brotspinat', 'Frischkäse-Brot mit Spinat & Ei', 6, 'snack', E, { toast: 60, frischkaese: 30, spinat: 30, eier: 1 }, 'Toast bestreichen, Spinat und Ei darauf.', SH);
  R('s-linsendip', 'Linsen-Dip mit Gemüsesticks', 10, 'snack', D, { linsendose: 125, karotten: 100, gurke: 0.5, tahini: 10 }, 'Linsen mit Tahini zerdrücken, mit Gemüsesticks essen.', SN);
  R('s-obstquark', 'Orangen-Quark', 3, 'snack', E, { quark: 200, orangen: 150, honig: 10 }, 'Orangenstücke mit Quark und Honig mischen.', SN);
  R('s-nussjoghurt', 'Griechischer Joghurt mit Honig & Nüssen', 3, 'snack', E, { griechjoghurt: 200, honig: 10, walnuss: 15 }, 'Joghurt mit Honig und gehackten Nüssen servieren.', SN);
  R('s-veggiewurst', 'Veggie-Würstchen mit Senf & Brot', 8, 'snack', E, { veggiewurst: 100, brot: 60 }, 'Würstchen anbraten, mit Brot essen.', SH);
  R('s-seitanwrap', 'Mini-Wrap mit Seitan & Salat', 8, 'snack', E, { wraps: 1, seitan: 60, salat: 0.25 }, 'Seitan anbraten, mit Salat in den Wrap rollen.', SH);
  R('s-ricottabeeren', 'Ricotta mit Beeren & Honig', 3, 'snack', E, { ricotta: 125, beeren: 80, honig: 10 }, 'Ricotta mit Beeren und Honig anrichten.', SN);
  R('s-rosinenporridge', 'Zimt-Porridge mit Rosinen & Quark', 8, 'snack', [], { haferflocken: 50, milch: 200, rosinen: 15, quark: 100 }, 'Haferflocken in Milch aufkochen, Rosinen und Quark unterrühren.', SH);
})();
