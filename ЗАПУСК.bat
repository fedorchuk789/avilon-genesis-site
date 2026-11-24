@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js не найден. Установите Node.js 22 LTS с https://nodejs.org
  echo  и запустите этот файл ещё раз.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo  Первый запуск: устанавливаю зависимости, это займёт 1-2 минуты...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo  Не удалось установить зависимости. Проверьте интернет и попробуйте снова.
    pause
    exit /b 1
  )
)

echo.
echo  Сайт запускается. Откройте в браузере: http://localhost:8080
echo  Чтобы остановить сайт, закройте это окно.
echo.
start "" http://localhost:8080
call npm run dev
pause
