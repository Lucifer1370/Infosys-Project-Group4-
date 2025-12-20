# Simple Frontend Server Starter
Write-Host "Starting Frontend Server..." -ForegroundColor Green

# Change to project root directory
Set-Location $PSScriptRoot

# Check if port 5500 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 5500 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Port 5500 is already in use!" -ForegroundColor Yellow
    Write-Host "Killing existing process..." -ForegroundColor Yellow
    $process = Get-Process -Id ($portInUse.OwningProcess) -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process.Id -Force
        Start-Sleep -Seconds 2
    }
}

Write-Host "Starting Python HTTP server on port 5500..." -ForegroundColor Cyan
Write-Host "Frontend URL: http://localhost:5500" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start server in current window
python -m http.server 5500

