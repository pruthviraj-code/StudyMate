@echo off
start "StudyMate API" cmd /k "cd /d %~dp0server && npm run dev"
start "StudyMate Client" cmd /k "cd /d %~dp0client && npm run dev"
echo Open http://localhost:5173 in your browser.
