# Wochenplaner Lidl

Statische Web-App (kein Backend): `index.html`, `app.js`, `data.js` (Katalog, Rezepte), `offers.js` (Wochenangebote). Deine Daten (Vorrat, Plan, Ausgaben) liegen nur im Browser (localStorage) und nicht im Repository.

## Auf GitHub veröffentlichen
1. Neues Repository anlegen und diesen Ordner hochladen.
2. Settings → Pages → Branch `main`, Ordner `/ (root)` → Speichern. Die App läuft dann unter `https://<name>.github.io/<repo>/`.
3. Settings → Actions → General → Workflow permissions: „Read and write permissions“.
4. Actions → „Lidl-Angebote aktualisieren“ → „Run workflow“ einmal zum Test.

## Angebote
`.github/workflows/offers.yml` startet jeden Sonntag gegen 22 Uhr `tools/update-offers.ps1`. Das Skript liest Lidl-Lebensmittelangebote von kaufda.de und prospektangebote.de (je ein Abruf pro Woche, nur in der robots.txt erlaubte Seiten), schreibt `offers.js` und committet es. Pages veröffentlicht die neue Datei automatisch. Schlägt das Auslesen fehl (weniger als 5 Treffer), bleibt `offers.js` unverändert, der Lauf wird rot, und die App zeigt „keine aktuellen Angebote geladen“.

Lokal testen: `powershell -ExecutionPolicy Bypass -File tools/update-offers.ps1`

Hinweis: Die Quellen liefern eine Auswahl, nicht den kompletten Prospekt. Alkohol und Fleisch/Fisch werden ausgeblendet.
