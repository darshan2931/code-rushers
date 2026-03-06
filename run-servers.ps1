# Kill any running node/npm processes
Get-Process node, npm -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Start backend
Write-Host "Starting Backend Server on port 5000..." -ForegroundColor Green
$backendPath = "c:\code rushers\autonomous-workflow-builder\backend\server.js"
Start-Process -FilePath "node" -ArgumentList $backendPath -WindowStyle Hidden -NoNewWindow

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting Frontend Server on port 3000..." -ForegroundColor Green
$frontendPath = "c:\code rushers\autonomous-workflow-builder"
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory $frontendPath -WindowStyle Hidden -NoNewWindow

# Wait for frontend to initialize
Start-Sleep -Seconds 5

# Test both servers
Write-Host "`nTesting Servers..." -ForegroundColor Cyan
try {
    $backendTest = Invoke-WebRequest http://localhost:5000/ -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Backend: Running (Status: $($backendTest.StatusCode))" -ForegroundColor Green
}
catch {
    Write-Host "❌ Backend: Not responding" -ForegroundColor Red
}

try {
    $frontendTest = Invoke-WebRequest http://localhost:3000/builder -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Frontend: Running (Status: $($frontendTest.StatusCode))" -ForegroundColor Green
}
catch {
    Write-Host "❌ Frontend: Not responding" -ForegroundColor Red
}

Write-Host "`n" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  🎉 WORKFLOW BUILDER IS READY!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📱 Frontend:  http://localhost:3000/builder" -ForegroundColor Cyan
Write-Host "🔌 Backend:   http://localhost:5000" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Keep PowerShell open
Read-Host "Press Enter to continue..."
