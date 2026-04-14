$appDir = Join-Path $env:USERPROFILE "Documents\SosyalMedyaAnaliz"
$starter = Join-Path $appDir "install_and_run.bat"

Write-Host "[Sosyal Media Analiz] Baslatiliyor..."
if (-not (Test-Path $starter)) {
  Write-Host "Uygulama bulunamadi: $appDir" -ForegroundColor Red
  Write-Host "Lutfen projeyi bu klasore kopyalayin."
  exit 1
}

Set-Location $appDir
Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$starter`"" -WindowStyle Normal
