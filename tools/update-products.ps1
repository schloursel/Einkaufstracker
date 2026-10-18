# Sammelt das komplette Lidl-Sortiment (ohne Drogerie) von supermarktcheck.de (zuletzt gemeldete Preise) und schreibt ../products.js.
# robots.txt erlaubt alles; trotzdem höflich: Pause zwischen Abrufen, ein Lauf pro Monat.
param([int]$DelaySec = 2, [int]$MaxPagesPerCategory = 150, [int]$MinTotal = 2000)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$ua = @{ 'User-Agent' = 'Einkaufstracker-Offers/1.0 (privat, 1x pro Monat)' }
$base = 'https://www.supermarktcheck.de'

function Get-Html($url) {
  for ($try = 1; $try -le 4; $try++) {
    try { return (Invoke-WebRequest -UseBasicParsing -Uri $url -Headers $ua -TimeoutSec 60).Content }
    catch { if ($try -eq 4) { throw }; Start-Sleep -Seconds (5 * $try) }
  }
}
$dec = { param($s) [System.Net.WebUtility]::HtmlDecode(($s -replace '\s+', ' ').Trim()) }

# Kategorien von der Sortiment-Übersicht
$idx = Get-Html "$base/lidl/sortiment/"
$cats = @()
foreach ($m in [regex]::Matches($idx, '<a[^>]*href="/lidl/sortiment/([a-z0-9-]+)/"[^>]*>\s*([^<]+?)\s*<span class="numbers">\((\d+)\)')) {
  $slug = $m.Groups[1].Value
  if ($slug -match 'drogerie') { continue }
  if ($cats | Where-Object { $_.slug -eq $slug }) { continue }
  $name = (& $dec $m.Groups[2].Value) -replace '\s+bei Lidl$', ''
  $cats += [pscustomobject]@{ slug = $slug; name = $name; count = [int]$m.Groups[3].Value }
}
if (-not $cats) { throw 'Keine Kategorien gefunden (Seitenaufbau geändert?).' }
Write-Host ("Kategorien: " + ($cats | ForEach-Object { $_.name + ' (' + $_.count + ')' }) -join '; ')

$seen = @{}
$rows = New-Object System.Collections.ArrayList
foreach ($c in $cats) {
  $pages = [math]::Min($MaxPagesPerCategory, [math]::Ceiling($c.count / 15.0) + 2)
  for ($p = 1; $p -le $pages; $p++) {
    Start-Sleep -Seconds $DelaySec
    $h = Get-Html "$base/lidl/sortiment/$($c.slug)/?page=$p"
    $blocks = [regex]::Split($h, 'supermarketListElement productListElement') | Select-Object -Skip 1
    if (-not $blocks) { break }
    $new = 0
    foreach ($b in $blocks) {
      $href = [regex]::Match($b, 'href="/product/(\d+)-[^"#]*"')
      $nm = [regex]::Match($b, 'class="h3"[^>]*>\s*([^<]+?)\s*</a>')
      $pr = [regex]::Match($b, 'class="price">\s*([0-9.]+,[0-9]{2})')
      if (-not ($href.Success -and $nm.Success -and $pr.Success)) { continue }
      $id = $href.Groups[1].Value
      if ($seen.ContainsKey($id)) { continue }
      $seen[$id] = 1; $new++
      $pk = [regex]::Match($b, 'Lidl</strong>\s*\(([^)]*)\)')
      $price = [double]::Parse(($pr.Groups[1].Value -replace '\.', '' -replace ',', '.'), [Globalization.CultureInfo]::InvariantCulture)
      [void]$rows.Add(@([int]$id, (& $dec $nm.Groups[1].Value), $c.name, $(if ($pk.Success) { & $dec $pk.Groups[1].Value } else { '' }), $price))
    }
    if ($new -eq 0 -and $p -gt 1) { break }
  }
  Write-Host ("{0}: gesamt {1}" -f $c.name, $rows.Count)
}
if ($rows.Count -lt $MinTotal) { throw "Nur $($rows.Count) Produkte gefunden (erwartet >= $MinTotal). products.js bleibt unverändert." }

function J($s) { '"' + ($s -replace '\\', '\\' -replace '"', '\"') + '"' }
$ci = [Globalization.CultureInfo]::InvariantCulture
$lines = foreach ($r in ($rows | Sort-Object { $_[2] }, { $_[1] })) {
  '[' + $r[0] + ',' + (J $r[1]) + ',' + (J $r[2]) + ',' + (J $r[3]) + ',' + $r[4].ToString($ci) + ']'
}
$out = "// Automatisch erzeugt von tools/update-products.ps1 - nicht von Hand ändern.`n// Zeile: [id, Name, Kategorie, Packung, zuletzt gemeldeter Preis in EUR]`nwindow.PRODUCTS = {`n  fetched: '" + (Get-Date).ToString('yyyy-MM-dd') + "',`n  source: 'supermarktcheck.de (zuletzt gemeldete Preise, ohne Gewähr)',`n  items: [`n" + ($lines -join ",`n") + "`n  ]`n};`n"
[IO.File]::WriteAllText((Join-Path $root 'products.js'), $out, (New-Object Text.UTF8Encoding($false)))
Write-Host "products.js geschrieben: $($rows.Count) Produkte."
