param(
  [string]$InstallPath = (Join-Path $env:LOCALAPPDATA "Kodzen\securitycheck")
)

$ErrorActionPreference = 'Stop'
$source = Split-Path -Parent $PSScriptRoot

Write-Host "[Kodzen] Full kurulum basladi: Kodzen SecurityCheck"
Write-Host "[Kodzen] Kaynak: $source"
Write-Host "[Kodzen] Hedef:  $InstallPath"

New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null
Copy-Item -Path (Join-Path $source '*') -Destination $InstallPath -Recurse -Force

$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'securitycheck-Full.url'
$targetFile = Join-Path $InstallPath 'full\index.html'
$url = 'file:///' + (($targetFile -replace '\\','/') -replace ' ','%20')

@"
[InternetShortcut]
URL=$url
"@ | Set-Content -Path $shortcutPath -Encoding ASCII

$launcher = Join-Path $InstallPath 'Run-Full.bat'
@"
@echo off
start "" "%~dp0full\index.html"
"@ | Set-Content -Path $launcher -Encoding ASCII

Write-Host "[Kodzen] Kurulum tamamlandi."
Write-Host "[Kodzen] Kisayol: $shortcutPath"
Write-Host "[Kodzen] Launcher: $launcher"
