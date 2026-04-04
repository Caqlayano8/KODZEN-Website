param(
  [string]$InstallPath = "C:\Program Files\Kodzen\securitycheck"
)

Write-Host "Kurulum baslatildi: Kodzen SecurityCheck"
Write-Host "Hedef klasor: $InstallPath"
New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null
Write-Host "Demo paket kopyalama adimi burada uygulanacak."
Write-Host "Kurulum tamamlandi."
