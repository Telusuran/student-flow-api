Write-Host "Restarting Database Container..."
docker restart studentflow-db

Write-Host "Cleaning up ports..."
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Starting API Server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/api; npm run dev"

Write-Host "Starting Web Server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/web; npm run dev"

Write-Host "Done! Services are spinning up."
