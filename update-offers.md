# Wöchentliches Angebote-Update (Sonntagnacht)

Ziel: `offers.js` im Projektordner mit den Lidl-Lebensmittelangeboten für die **kommende** Woche (ab nächstem Montag) neu schreiben. Das Format steht in der aktuellen `offers.js`; nur diese Datei ändern (plus ggf. `data.js`-Preise, siehe Schritt 4).

## Schritte
1. `week` = ISO-Datum des kommenden Montags, `fetched` = heutiges Datum.
2. **Zuerst Claude in Chrome versuchen:** `mcp__claude-in-chrome__list_connected_browsers` (Tools ggf. per ToolSearch laden). Ist ein Browser verbunden, in einem neuen Tab https://www.lidl.de/c/online-prospekte/s10005610 öffnen, den Wochenprospekt (gültig ab kommendem Montag) bzw. https://www.lidl.de/c/billiger-montag/a10006065 und die Lebensmittel-Kategorien lesen (get_page_text), Cookie-Banner nicht akzeptieren, nur lesen, danach den Tab schließen. Ist keiner verbunden, weiter mit den Portalen unten und das in `source` vermerken.
   Angebote sammeln (WebFetch), jeweils nur Lebensmittel, Preis und Menge/Grundpreis erfassen:
   - https://www.kaufda.de/Geschaefte/Lidl (Auswahl der Prospekt-Angebote, Gültigkeit prüfen)
   - https://www.prospektangebote.de/geschaefte/lidl/angebote (Seiten `?page=1…`, Preis/Statt-Preis, nur Angebote mit passender Gültigkeit)
   - https://www.lidl.de/c/billiger-montag/a10006065 und https://www.lidl.de/c/online-prospekte/s10005610 (liefern per WebFetch meist nur Prospekttitel; Inhalt ggf. über Claude in Chrome lesen, falls verfügbar)
   Wenn der Prospekt der Folgewoche noch nicht online ist: `week` trotzdem setzen, nur Dauerangebote eintragen und in `source` vermerken „Wochenprospekt noch nicht verfügbar“.
3. Nichts erfinden: nur Angebote eintragen, die auf einer Quelle stehen. Unbekannte Mengen im Feld `info` vermerken.
4. Passt ein Angebot sicher zu einem Katalogartikel in `data.js` (gleiche Produktart UND Packungsgröße), `catalogId` und `packPrice` setzen. Zusätzlich dort, wo supermarktcheck.de (https://www.supermarktcheck.de/lidl/sortiment/<kategorie>/) einen neueren „zuletzt gemeldeten Preis“ zeigt, Katalogpreise für Artikel mit `est: true` aktualisieren und `est` entfernen.
5. `source` ehrlich beschreiben (welche Quellen, ob vollständig).
6. Kurze Zusammenfassung ausgeben: Anzahl Angebote, nutzbare Treffer, Lücken.
