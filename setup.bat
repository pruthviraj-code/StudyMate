@echo off
echo Installing server dependencies...
cd /d "%~dp0server"
call npm install
echo.
echo Installing client dependencies...
cd /d "%~dp0client"
call npm install
echo.
echo Done. Now run start.bat
pause
