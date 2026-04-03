$ErrorActionPreference = 'SilentlyContinue'

$conn = Get-NetTCPConnection -LocalPort 3001 -State Listen
if ($conn) {
  $portPid = $conn[0].OwningProcess
  Stop-Process -Id $portPid -Force
  Write-Output "Stopped PID $portPid on port 3001"
} else {
  Write-Output "Port 3001 is already free"
}

if (Test-Path .next) {
  Remove-Item -Recurse -Force .next
  Write-Output "Removed .next cache"
}

$ErrorActionPreference = 'Continue'
npm.cmd run dev -- --port 3001
