@echo off
echo Starting HTTP Server for Weight Management App...
echo Please open browser and go to: http://localhost:3000
echo Press Ctrl+C to stop the server
cd /d "C:\Users\user\Desktop\work\90_cc\20250806\weight-management-app"
python -m http.server 3000
pause