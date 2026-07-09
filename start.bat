@echo off
title PEACH_PULSE.AI Startup Control
echo ====================================================
echo             PEACH_PULSE.AI SERVER ENGINE
echo ====================================================
echo.
echo [System] Initializing Flask AI server in separate process...
start "PEACH_PULSE.AI Backend Server" cmd /k "mihir\Scripts\python.exe run.py"
echo [System] Waiting for backend to spin up...
timeout /t 3 /nobreak > nul
echo [System] Opening default browser to http://127.0.0.1:5000/...
start http://127.0.0.1:5000/
echo [System] Application launched successfully. Exiting startup script.
timeout /t 2 /nobreak > nul
exit
