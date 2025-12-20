# Test Connection Script
Write-Host "=== Testing Server Connections ===" -ForegroundColor Green

Write-Host "`n1. Testing Backend Server (Port 5000)..." -ForegroundColor Yellow
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "   [OK] Backend is running!" -ForegroundColor Green
    Write-Host "   Response: $($backend.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   [ERROR] Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing Frontend Server (Port 5500)..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5500" -UseBasicParsing -TimeoutSec 3
    Write-Host "   [OK] Frontend is running!" -ForegroundColor Green
    Write-Host "   Status Code: $($frontend.StatusCode)" -ForegroundColor Gray
    Write-Host "   Content Length: $($frontend.Content.Length) bytes" -ForegroundColor Gray
} catch {
    Write-Host "   [ERROR] Frontend is NOT accessible!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing Login Page..." -ForegroundColor Yellow
try {
    $login = Invoke-WebRequest -Uri "http://localhost:5500/frontend/pages/login.html" -UseBasicParsing -TimeoutSec 3
    Write-Host "   [OK] Login page is accessible!" -ForegroundColor Green
    Write-Host "   Status Code: $($login.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "   [ERROR] Login page NOT accessible!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Try: http://localhost:5500/index.html" -ForegroundColor Yellow
}

Write-Host "`n=== Access URLs ===" -ForegroundColor Green
Write-Host "Main Page: http://localhost:5500" -ForegroundColor Cyan
Write-Host "Login Page: http://localhost:5500/frontend/pages/login.html" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000/api/health" -ForegroundColor Cyan

Write-Host "`n=== Next Steps ===" -ForegroundColor Yellow
Write-Host "1. Open browser and go to: http://localhost:5500" -ForegroundColor White
Write-Host "2. If that doesn't work, try: http://localhost:5500/index.html" -ForegroundColor White
Write-Host "3. Or directly: http://localhost:5500/frontend/pages/login.html" -ForegroundColor White

