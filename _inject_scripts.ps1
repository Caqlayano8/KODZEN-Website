$root = 'C:\Users\kurto\Documents\GitHub\KODZEN-Website'
$files = Get-ChildItem $root -Filter *.html | Where-Object { $_.Name -ne '_index_live_snapshot.html' }

foreach ($f in $files) {
  $c = Get-Content $f.FullName -Raw -Encoding UTF8
  if ($c -match 'js/navbar-fix.js') { continue }

  $injected = '<script src="js/navbar-fix.js"></script>' + "`r`n" + '<script src="js/newsletter.js"></script>'

  if ($c -match '(?i)</body>') {
    $c = [regex]::Replace($c, '(?i)</body>', "$injected`r`n</body>", 1)
  } elseif ($c -match '(?i)</html>') {
    $c = [regex]::Replace($c, '(?i)</html>', "$injected`r`n</html>", 1)
  } else {
    $c += "`r`n$injected`r`n"
  }

  Set-Content -Path $f.FullName -Value $c -Encoding UTF8
}

Write-Host "Injected scripts into HTML files."