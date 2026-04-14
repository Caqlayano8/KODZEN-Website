@echo off
setlocal
set "APP_DIR=%USERPROFILE%\Documents\SosyalMedyaAnaliz"

echo [Sosyal Media Analiz] Baslatiliyor...
if not exist "%APP_DIR%\install_and_run.bat" (
  echo Uygulama bulunamadi: %APP_DIR%
  echo Lutfen projeyi bu klasore kopyalayin.
  pause
  exit /b 1
)

cd /d "%APP_DIR%"
call install_and_run.bat
endlocal
