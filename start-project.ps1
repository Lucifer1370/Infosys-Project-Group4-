# Start Project - Backend and Frontend Servers
Write-Host "=== Starting Medication Tracker Project ===" -ForegroundColor Green

# Check if backend server is running
Write-Host "`n1. Checking backend server..." -ForegroundColor Yellow
$backendRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "   [OK] Backend server is already running on port 5000" -ForegroundColor Green
        $backendRunning = $true
    }
} catch {
    Write-Host "   [INFO] Backend server is not running. Starting it now..." -ForegroundColor Yellow
    
    # Start backend server
    Set-Location backend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Starting Backend Server...' -ForegroundColor Cyan; npm start" -WindowStyle Minimized
    Set-Location ..
    
    Write-Host "   [OK] Backend server starting..." -ForegroundColor Green
    Write-Host "   Waiting 5 seconds for server to initialize..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    
    # Verify backend started
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "   [OK] Backend server is now running!" -ForegroundColor Green
            $backendRunning = $true
        } else {
            Write-Host "   [WARNING] Backend might still be starting. Wait a few seconds." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   [WARNING] Backend is starting. Please wait..." -ForegroundColor Yellow
    }
}

# Start frontend server (using Python's http.server or Node's http-server)
Write-Host "`n2. Starting frontend server..." -ForegroundColor Yellow

# Check if Python is available
$pythonAvailable = $false
try {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion) {
        Write-Host "   [INFO] Python found: $pythonVersion" -ForegroundColor Cyan
        $pythonAvailable = $true
    }
} catch {
    Write-Host "   [INFO] Python not found, trying other methods..." -ForegroundColor Gray
}

# Check if http-server (npm) is available
$httpServerAvailable = $false
try {
    $httpServerVersion = npx http-server --version 2>&1
    if ($httpServerVersion -notmatch "command not found") {
        Write-Host "   [INFO] http-server found" -ForegroundColor Cyan
        $httpServerAvailable = $true
    }
} catch {
    Write-Host "   [INFO] http-server not available" -ForegroundColor Gray
}

# Start frontend server
if ($pythonAvailable) {
    Write-Host "   [OK] Starting frontend with Python HTTP server on port 5500..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Frontend Server (Python) - Port 5500' -ForegroundColor Cyan; Write-Host 'Open: http://localhost:5500' -ForegroundColor Yellow; python -m http.server 5500" -WindowStyle Minimized
} elseif ($httpServerAvailable) {
    Write-Host "   [OK] Starting frontend with http-server on port 5500..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'Frontend Server (http-server) - Port 5500' -ForegroundColor Cyan; Write-Host 'Open: http://localhost:5500' -ForegroundColor Yellow; npx http-server -p 5500 -c-1" -WindowStyle Minimized
} else {
    Write-Host "   [WARNING] No frontend server found!" -ForegroundColor Red
    Write-Host "   Please install one of the following:" -ForegroundColor Yellow
    Write-Host "   Option 1: Install Python (recommended)" -ForegroundColor White
    Write-Host "   Option 2: Install http-server: npm install -g http-server" -ForegroundColor White
    Write-Host "   Option 3: Use VS Code Live Server extension" -ForegroundColor White
    Write-Host "`n   After installing, run this script again." -ForegroundColor Cyan
}

# Summary
Write-Host "`n=== Server Status ===" -ForegroundColor Green
if ($backendRunning) {
    Write-Host "[OK] Backend:  http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "[INFO] Backend: Starting... http://localhost:5000" -ForegroundColor Yellow
}

if ($pythonAvailable -or $httpServerAvailable) {
    Write-Host "[OK] Frontend: http://localhost:5500" -ForegroundColor Green
    Write-Host "`n=== Access Your Application ===" -ForegroundColor Cyan
    Write-Host "Open your browser and go to: http://localhost:5500" -ForegroundColor Yellow
    Write-Host "The page will redirect to the login page automatically." -ForegroundColor Gray
} else {
    Write-Host "[ERROR] Frontend: Not started (see instructions above)" -ForegroundColor Red
}

Write-Host "`n=== Important Notes ===" -ForegroundColor Yellow
Write-Host "1. Backend server must be running for API calls to work" -ForegroundColor White
Write-Host "2. Frontend server is needed to serve HTML/CSS/JS files" -ForegroundColor White
Write-Host "3. Keep both server windows open while using the application" -ForegroundColor White
Write-Host "`nPress any key to open the application in your browser..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
if ($pythonAvailable -or $httpServerAvailable) {
    Start-Process "http://localhost:5500"
}

