# Einkaufstracker

Statische Web-App ohne Backend und ohne Build: Wochenplan, Einkaufsliste und Vorrat für Lidl (vegetarisch, eiweißreich, sparsam). Deine Daten (Plan, Vorrat, Einstellungen, eigene Rezepte) liegen nur im Browser (localStorage) und nicht im Repository.

## Aufbau
- `index.html` (Gerüst, Design), `app/` (Kern, UI, Home, Plan, Einkauf/Vorrat, Mehr, Start)
- `data.js`: Grundkatalog, erste 20 Rezepte, Shake, Nährwerte, Lagerorte, Geräte
- `data-more.js`: weitere Katalogartikel (insgesamt ca. 80) und Rezepte (insgesamt 88: 73 Gerichte, 15 Snacks mit Tags einfach / Dip / Ein-Topf)
- `offers.js`, `products.js`, `nutrition.js`: Daten, automatisch erzeugt (siehe unten)
- `manifest.webmanifest`, `sw.js`, `icons/`: Installation als App und Offline-Betrieb

Untere Leiste: Home · Plan · Einkauf · Vorrat · Mehr. Mehr enthält Angebote, Alle Produkte, Gerichte & eigene Rezepte, Preise & Katalog, Tracker, Einstellungen, Backup, Info.

## Auf GitHub veröffentlichen
1. Neues Repository anlegen und diesen Ordner hochladen (ohne `.claude`).
2. Settings → Pages → Branch `main`, Ordner `/ (root)` → Speichern. Die App läuft dann unter `https://<name>.github.io/<repo>/`.
3. Settings → Actions → General → Workflow permissions: „Read and write permissions“.
4. Actions → „Lidl-Angebote aktualisieren“ → „Run workflow“ einmal zum Test.

## Als App installieren
- **iPhone (Safari):** Teilen → „Zum Home-Bildschirm“.
- **Android (Chrome):** Menü → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.
- **PC (Chrome/Edge):** Installieren-Symbol in der Adressleiste.
Der Service Worker (`sw.js`) lädt App-Dateien aus dem Cache und holt `offers.js`, `products.js`, `nutrition.js` bei Netz immer frisch. Nach einem App-Update die Seite einmal neu laden. Beim Entwickeln: `localStorage.et_nosw = 1` schaltet den Service Worker ab.

## Angebote (wöchentlich)
`.github/workflows/offers.yml` startet jeden Sonntag gegen 22 Uhr `tools/update-offers.ps1`. Das Skript liest Lidl-Lebensmittelangebote von kaufda.de und prospektangebote.de (je ein Abruf pro Woche, nur in der robots.txt erlaubte Seiten), schreibt `offers.js` und committet es. Schlägt das Auslesen fehl (weniger als 5 Treffer), bleibt `offers.js` unverändert, und die App zeigt „Angebote nicht aktuell“. Die Quellen liefern eine Auswahl, nicht den kompletten Prospekt. Alkohol, Fleisch und Fisch werden ausgeblendet.

## Alle Produkte (monatlich)
`products.js` enthält das Lidl-Sortiment ohne Drogerie (ca. 7.300 Produkte mit zuletzt gemeldetem Preis, Quelle supermarktcheck.de). `.github/workflows/products.yml` erneuert sie am 1. jedes Monats mit `tools/update-products.ps1` (ca. 30 Minuten wegen Pausen zwischen den Abrufen).

## Nährwerte
- Katalog und Rezepte: Richtwerte (Durchschnitt, Rohgewichte) in `data.js` (`NUTR`); Rezepte rechnen ca. 10 g Öl je Portion ein.
- Alle Produkte: `nutrition.js` (je 100 g von den Produktseiten bei supermarktcheck.de). `.github/workflows/nutrition.yml` ergänzt jeden Mittwoch bis zu 3.500 Produkte (`tools/update-nutrition.ps1`), bis alle erfasst sind (ca. 2 Wochen).

## Plan
Jeden Morgen Mo–Fr der Shake (`SHAKE` in `data.js`: 250 g Magerquark, 300 ml Milch, 1 Banane, 20 g Honig, Zimt). Mo–Do ein Gericht für Mittag und Abend (einmal kochen, 2 Portionen) oder getrennt (je 1 Portion). Freitag nur Shake.

Lokal testen: `powershell -ExecutionPolicy Bypass -File tools/update-offers.ps1`
