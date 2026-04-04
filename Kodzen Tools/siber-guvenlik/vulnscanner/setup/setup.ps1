param(
  [string]$InstallPath = "C:\Program Files\Kodzen\vulnscanner"
)

$ErrorActionPreference = 'Stop'
$source = Split-Path -Parent $PSScriptRoot

Write-Host "[Kodzen] Full kurulum basladi: Kodzen Vulnerability Scanner"
Write-Host "[Kodzen] Kaynak: $source"
Write-Host "[Kodzen] Hedef:  $InstallPath"

New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null
Copy-Item -Path (Join-Path $source '*') -Destination $InstallPath -Recurse -Force

$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'vulnscanner-Full.url'
$url = 'file:///' + ((Join-Path $InstallPath 'full\index.html') -replace '\\','/')

@"
[InternetShortcut]
URL=$url
"@ | Set-Content -Path $shortcutPath -Encoding ASCII

Write-Host "[Kodzen] Kurulum tamamlandi."
Write-Host "[Kodzen] Kisayol: $shortcutPath"
