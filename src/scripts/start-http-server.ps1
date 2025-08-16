# PowerShell HTTP Server for Weight Management App
$port = 3000
$path = "C:\Users\user\Desktop\work\90_cc\20250807\weight-management-template"

Write-Host "Starting HTTP Server..." -ForegroundColor Green
Write-Host "Access URL: http://localhost:$port" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Red

Set-Location $path

# Try Python first
if (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $port
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    python3 -m http.server $port
} elseif (Get-Command node -ErrorAction SilentlyContinue) {
    npx http-server -p $port
} else {
    Write-Host "Installing http-server via npm..." -ForegroundColor Yellow
    npm install -g http-server
    http-server -p $port
}