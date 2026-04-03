const { spawnSync } = require('node:child_process');
const path = require('node:path');

function commandExists(command, args) {
  const result = spawnSync(command, args, { stdio: 'ignore', shell: false });
  return result.status === 0;
}

function resolvePowerShellCommand() {
  if (commandExists('pwsh', ['-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()'])) {
    return 'pwsh';
  }

  if (process.platform === 'win32' && commandExists('powershell', ['-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()'])) {
    return 'powershell';
  }

  return null;
}

const shellCommand = resolvePowerShellCommand();
if (!shellCommand) {
  console.error('Unable to find PowerShell. Install pwsh (recommended) or Windows PowerShell to run dev:reset.');
  process.exit(1);
}

const scriptPath = path.join(__dirname, 'dev-reset.ps1');
const result = spawnSync(
  shellCommand,
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath],
  { stdio: 'inherit' },
);

process.exit(result.status ?? 1);
