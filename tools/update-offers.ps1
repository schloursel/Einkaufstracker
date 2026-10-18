# Holt Lidl-Lebensmittelangebote (kaufda.de + prospektangebote.de) und schreibt ../offers.js.
# Läuft mit Windows PowerShell 5.1 und PowerShell 7 (GitHub Actions). 1 Lauf pro Woche, höflich (Pause, nur erlaubte ?page=N-URLs).
param([int]$MaxPages = 25, [int]$DelaySec = 3)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$ua = @{ 'User-Agent' = 'Einkaufstracker-Offers/1.0 (privat, 1x pro Woche)' }
$today = (Get-Date).Date
$dow = [int]$today.DayOfWeek                       # So=0 ... Sa=6
$monday = $today.AddDays((8 - $dow) % 7)           # nächster Montag (heute, falls Montag)
$dec = { param($s) [System.Net.WebUtility]::HtmlDecode(($s -replace '\s+', ' ').Trim()) }
function ToNum($s) { [double]::Parse(($s -replace '[^\d,]', '' -replace ',', '.'), [Globalization.CultureInfo]::InvariantCulture) }

$FOOD = 'Milbona|Alesto|Belbake|Freshona|Vemondo|Combino|Chef Select|Deluxe|Bellarom|Crownfield|Dulano|Metzgerfrisch|Sol Mar|Golden Sun|Eridanous|Salakis|Biotrend|Bioness|Kartoffel|Möhr|Karott|Zwiebel|Tomate|Paprika|Gurke|Salat|Apfel|Äpfel|Birne|Banane|Traube|Mandarin|Orange|Zitrone|Brokkoli|Spinat|Pilz|Champignon|Zucchini|Kürbis|Kohl|Joghurt|Skyr|Quark|Käse|Mozzarella|Feta|Halloumi|Ei(er)?\b|Milch|Butter|Tofu|Linsen|Bohnen|Kichererbsen|Nudel|Pasta|Reis|Hafer|Müsli|Brot|Brötchen|Wrap|Kefir|Mandel|Nuss|Nüsse|Hummus|Pesto|Soße|Sauce|Suppe|Schokolade|Kaffee|Tee\b|Saft|Pizza|Fleisch|Hack|Wurst|Schinken|Lachs|Fisch|Gemüse|Obst|Honigpomelo|Avocado|Beeren|Erdnuss'
# Nicht angezeigt: Alkohol sowie Fleisch/Fisch (vegetarisch)
$SKIP = 'Wein|Crémant|Cremant|Sekt|Prosecco|Primitivo|Whisky|Gin\b|Pils|Bier|Likör|Vodka|Rum\b|Metzgerfrisch|Fleisch|Hack|Wurst|Schinken|Steak|Gulasch|Frikadelle|Lachs|Forelle|Fisch|Garnele|Hähnchen|Hühnchen|Pute|Schwein|Rind|Salami|Speck'
# Zuordnung zu Katalogartikeln: nur wenn Name UND Packungsgröße passen (sonst keine Preisübernahme in die Planung)
$RULES = @(
  @{ id = 'skyr';     re = 'Skyr';                 pack = '500 ?g' },
  @{ id = 'quark';    re = 'Speisequark.*Mager|Magerquark'; pack = '500 ?g' },
  @{ id = 'eier';     re = 'Eier.*Bodenhaltung';   pack = '10' },
  @{ id = 'tofu';     re = 'Tofu natur|Tofu Natur'; pack = '400|2 ?x ?200' },
  @{ id = 'kartoffeln'; re = 'Speisekartoffel|Kartoffeln'; pack = '2 ?kg' },
  @{ id = 'zwiebeln'; re = 'Speisezwiebel|Zwiebeln'; pack = '1 ?kg' },
  @{ id = 'karotten'; re = 'Möhren|Karotten';      pack = '1 ?kg' },
  @{ id = 'nudeln';   re = 'Vollkorn.*(Nudel|Spaghetti|Penne|Fusilli|Farfalle)'; pack = '500 ?g' },
  @{ id = 'reis';     re = 'Langkorn';             pack = '1 ?kg|1000 ?g' },
  @{ id = 'haferflocken'; re = 'Haferflocken';     pack = '500 ?g' },
  @{ id = 'hummus';   re = 'Hummus';               pack = '200 ?g' }
)

function Get-Page($url) { Invoke-WebRequest -UseBasicParsing -Uri $url -Headers $ua -TimeoutSec 60 }

$items = @{}
$sources = @()
function Add-Offer($name, $price, $info) {
  $name = & $dec $name
  if ($name -notmatch $FOOD -or $name -match $SKIP) { return }
  $key = ($name.ToLower() + '|' + $price)
  if ($items.ContainsKey($key)) { return }
  $items[$key] = [ordered]@{ name = $name; price = [math]::Round($price, 2); info = $info }
}

# --- Quelle 1: kaufda.de (Auswahl der Prospekt-Highlights) ---
try {
  $k = (Get-Page 'https://www.kaufda.de/Geschaefte/Lidl').Content
  $n0 = $items.Count
  foreach ($m in [regex]::Matches($k, '<p[^>]*>([^<]{3,80})</p><p[^>]*>Lidl</p>.{0,500}?font-bold">\s*([0-9]+,[0-9]{2})\s*€')) {
    Add-Offer $m.Groups[1].Value (ToNum $m.Groups[2].Value) 'kaufda.de, Prospekt der Woche'
  }
  $sources += ('kaufda.de (' + ($items.Count - $n0) + ')')
} catch { Write-Warning ('kaufda.de: ' + $_.Exception.Message) }

# --- Quelle 2: prospektangebote.de (alle Lidl-Angebote, nach Beliebtheit sortiert, mit Gültigkeit) ---
try {
  $n0 = $items.Count
  for ($p = 1; $p -le $MaxPages; $p++) {
    Start-Sleep -Seconds $DelaySec
    $h = (Get-Page "https://www.prospektangebote.de/geschaefte/lidl/angebote?page=$p").Content
    $blocks = [regex]::Split($h, 'js-offer-link-item') | Select-Object -Skip 1
    if (-not $blocks) { break }
    foreach ($b in $blocks) {
      $nm = [regex]::Match($b, 'product__name[^>]*>\s*([^<]+?)\s*</h3>')
      $pr = [regex]::Match($b, 'product__price-offer[^>]*>\s*€?\s*([0-9]+,[0-9]{2})')
      if (-not ($nm.Success -and $pr.Success)) { continue }
      $dt = [regex]::Match($b, 'product-date[^>]*>\s*([^<]+?)\s*<')
      $when = if ($dt.Success) { & $dec $dt.Groups[1].Value } else { '' }
      # Gültigkeit grob prüfen: relevant, wenn sie vor Freitag der Zielwoche beginnt und nach dem Montag noch läuft
      $keep = $true
      if ($when -match 'in (\d+) Tag') { if ($today.AddDays([int]$Matches[1]) -gt $monday.AddDays(4)) { $keep = $false } }
      elseif ($when -match '^Gültig (\d+) Tage') { if ($today.AddDays([int]$Matches[1]) -lt $monday) { $keep = $false } }
      if ($keep) { Add-Offer $nm.Groups[1].Value (ToNum $pr.Groups[1].Value) ('prospektangebote.de' + $(if ($when) { ', ' + $when } else { '' })) }
    }
  }
  $sources += ('prospektangebote.de (' + ($items.Count - $n0) + ')')
} catch { Write-Warning ('prospektangebote.de: ' + $_.Exception.Message) }

if ($items.Count -lt 5) { throw "Nur $($items.Count) Angebote gefunden. offers.js bleibt unverändert." }

# Katalogzuordnung
foreach ($it in $items.Values) {
  foreach ($r in $RULES) {
    if ($it.name -match $r.re -and ($it.name -match $r.pack -or $it.info -match $r.pack)) { $it.catalogId = $r.id; $it.packPrice = $it.price; break }
  }
}

function J($s) { '"' + ($s -replace '\\', '\\' -replace '"', '\"') + '"' }
$lines = foreach ($it in ($items.Values | Sort-Object { $_.name })) {
  $extra = if ($it.catalogId) { ', catalogId: ' + (J $it.catalogId) + ', packPrice: ' + $it.packPrice.ToString([Globalization.CultureInfo]::InvariantCulture) } else { '' }
  '    { name: ' + (J $it.name) + ', price: ' + $it.price.ToString([Globalization.CultureInfo]::InvariantCulture) + ', info: ' + (J $it.info) + $extra + ' }'
}
$src = ($sources -join ', ') + ' · Lebensmittel-Auswahl, evtl. unvollständig'
$out = "// Automatisch erzeugt von tools/update-offers.ps1 - nicht von Hand ändern.`r`nwindow.OFFERS = {`r`n  week: '" + $monday.ToString('yyyy-MM-dd') + "',`r`n  fetched: '" + $today.ToString('yyyy-MM-dd') + "',`r`n  source: " + (J $src) + ",`r`n  items: [`r`n" + ($lines -join ",`r`n") + "`r`n  ]`r`n};`r`n"
[IO.File]::WriteAllText((Join-Path $root 'offers.js'), $out, (New-Object Text.UTF8Encoding($false)))
Write-Host "offers.js geschrieben: $($items.Count) Angebote, Woche ab $($monday.ToString('yyyy-MM-dd')), Quellen: $($sources -join ', ')"
