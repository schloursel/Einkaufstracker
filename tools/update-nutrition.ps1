# Ergänzt ../nutrition.js schrittweise um Nährwerte je 100 g (von den Produktseiten bei supermarktcheck.de).
# Pro Lauf höchstens -Batch neue Produkte (höflich: Pause zwischen den Abrufen). Bereits erfasste werden übersprungen,
# Produkte ohne Nährwertangabe werden mit 0 markiert und nicht erneut abgefragt.
param([int]$Batch = 3500, [int]$DelaySec = 2)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$ua = @{ 'User-Agent' = 'Einkaufstracker-Offers/1.0 (privat, wöchentlich kleine Tranche)' }
$ci = [Globalization.CultureInfo]::InvariantCulture
$utf8 = New-Object Text.UTF8Encoding($false)

$prodFile = Join-Path $root 'products.js'
$nutFile = Join-Path $root 'nutrition.js'
if (-not (Test-Path $prodFile)) { throw 'products.js fehlt.' }

# Produkte lesen: [id,"Name","Kategorie","Packung",Preis]
$prods = New-Object System.Collections.ArrayList
foreach ($m in [regex]::Matches([IO.File]::ReadAllText($prodFile, [Text.Encoding]::UTF8), '(?m)^\[(\d+),"((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"')) {
  [void]$prods.Add([pscustomobject]@{ id = $m.Groups[1].Value; cat = $m.Groups[3].Value })
}
if ($prods.Count -eq 0) { throw 'Keine Produkte in products.js gefunden.' }

# bisher erfasste Nährwerte
$map = [ordered]@{}
if (Test-Path $nutFile) {
  foreach ($m in [regex]::Matches([IO.File]::ReadAllText($nutFile, [Text.Encoding]::UTF8), '(?m)^"(\d+)":(0|\[[^\]]*\])')) { $map[$m.Groups[1].Value] = $m.Groups[2].Value }
}

# Reihenfolge: für vegetarische Küche wichtige Kategorien zuerst
$prio = 'Molkerei', 'Nahrungsmittel', 'Konserven', 'Frische Lebensmittel', 'Tiefk', 'Müsli', 'Backwaren', 'Saucen', 'Fleisch', 'Süßwaren', 'Getränke'
function Rank($c) { for ($i = 0; $i -lt $prio.Count; $i++) { if ($c -like ($prio[$i] + '*')) { return $i } }; return 99 }
$todo = $prods | Where-Object { -not $map.Contains($_.id) } | Sort-Object { Rank $_.cat } | Select-Object -First $Batch
Write-Host "Bereits erfasst: $($map.Count) · offen gesamt: $(($prods | Where-Object { -not $map.Contains($_.id) }).Count) · diese Tranche: $(@($todo).Count)"

function Num($html, $pattern) {
  $m = [regex]::Match($html, $pattern)
  if (-not $m.Success) { return $null }
  [double]::Parse(($m.Groups[1].Value -replace '\.', '' -replace ',', '.'), $ci)
}
function Save-Map {
  $lines = foreach ($k in $map.Keys) { '"' + $k + '":' + $map[$k] }
  $out = "// Nährwerte je 100 g aus supermarktcheck.de, Schlüssel = Produkt-ID aus products.js: [kcal, Eiweiß, Kohlenhydrate, Fett, Ballaststoffe]; 0 = keine Angabe.`n// Wird wöchentlich von tools/update-nutrition.ps1 schrittweise erweitert.`nwindow.NUTRI = {`n" + ($lines -join ",`n") + "`n};`n"
  [IO.File]::WriteAllText($nutFile, $out, $utf8)
}

$n = 0; $fail = 0
foreach ($p in $todo) {
  Start-Sleep -Seconds $DelaySec
  try { $h = (Invoke-WebRequest -UseBasicParsing -Uri "https://www.supermarktcheck.de/product/$($p.id)" -Headers $ua -TimeoutSec 60).Content }
  catch { $fail++; if ($fail -gt 25) { Write-Warning 'Zu viele Fehler, Abbruch (Zwischenstand wird gespeichert).'; break }; continue }
  $k = Num $h 'Kalorien in Kcal</td>\s*<td>([0-9.,]+)'
  if ($null -eq $k) { $map[$p.id] = '0' }
  else {
    $pr = Num $h 'Protein / Eiwe[^<]*</td>\s*<td>([0-9.,]+)'
    $c = Num $h 'Kohlenhydrate in Gramm</td>\s*<td>([0-9.,]+)'
    $f = Num $h '>Fett in Gramm</td>\s*<td>([0-9.,]+)'
    $b = Num $h 'Ballaststoffe in Gramm</td>\s*<td>([0-9.,]+)'
    $vals = @($k, $pr, $c, $f, $b) | ForEach-Object { if ($null -eq $_) { 0 } else { $_.ToString($ci) } }
    $map[$p.id] = '[' + ($vals -join ',') + ']'
  }
  $n++
  if ($n % 200 -eq 0) { Save-Map; Write-Host "$n verarbeitet" }
}
if ($n -gt 0) { Save-Map }
Write-Host "Fertig: $n neue Einträge, $($map.Count) gesamt."
