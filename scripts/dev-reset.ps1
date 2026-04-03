$previousErrorActionPreference = $ErrorActionPreference

try {
  $ErrorActionPreference = 'Continue'
  $connections = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
  $portPids = @(
    $connections |
      Select-Object -ExpandProperty OwningProcess -Unique |
      Where-Object { $_ }
  )

  if ($portPids.Count -gt 0) {
    foreach ($portPid in $portPids) {
      $process = Get-CimInstance Win32_Process -Filter "ProcessId = $portPid" -ErrorAction SilentlyContinue
      $processName = if ($process -and $process.Name) { $process.Name } else { 'unknown' }
      $commandLine = if ($process -and $process.CommandLine) { $process.CommandLine } else { '' }

      if ($commandLine -match '(?i)d-sales' -and $commandLine -match '(?i)(next|npm|node)(\.cmd)?') {
        Stop-Process -Id $portPid -Force -ErrorAction Stop
        Write-Output "Stopped PID $portPid ($processName) on port 3001"
      } else {
        Write-Warning "Port 3001 is used by PID $portPid ($processName). Skipping because it does not look like this workspace dev server."
      }
    }
  } else {
    Write-Output 'Port 3001 is already free'
  }

  if (Test-Path .next) {
    Remove-Item -Recurse -Force .next -ErrorAction Stop
    Write-Output 'Removed .next cache'
  }

  npm.cmd run dev -- --port 3001
}
finally {
  $ErrorActionPreference = $previousErrorActionPreference
}
