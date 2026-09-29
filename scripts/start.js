const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const serviceName = (
  process.env.RAILWAY_SERVICE_NAME ||
  process.env.SERVICE_NAME ||
  process.env.APP_NAME ||
  ''
).toLowerCase();

console.log(`[VYRO Launcher] Initializing service launcher...`);
console.log(`[VYRO Launcher] RAILWAY_SERVICE_NAME="${process.env.RAILWAY_SERVICE_NAME || ''}"`);
console.log(`[VYRO Launcher] SERVICE_NAME="${process.env.SERVICE_NAME || ''}"`);
console.log(`[VYRO Launcher] APP_NAME="${process.env.APP_NAME || ''}"`);
console.log(`[VYRO Launcher] PORT="${process.env.PORT || '3000'}"`);

let command = '';
let args = [];
let workingDir = process.cwd();

if (serviceName.includes('web') && !serviceName.includes('api')) {
  console.log('[VYRO Launcher] Selected Target: WEBSITE (Next.js)');
  workingDir = path.resolve(process.cwd(), 'apps/website');
  command = 'npx';
  args = ['next', 'start', '-p', process.env.PORT || '3000', '-H', '0.0.0.0'];
} else if (
  serviceName.includes('tg') ||
  serviceName.includes('mini') ||
  serviceName.includes('telegram')
) {
  console.log('[VYRO Launcher] Selected Target: TELEGRAM MINI APP (Next.js)');
  workingDir = path.resolve(process.cwd(), 'apps/telegram-mini-app');
  command = 'npx';
  args = ['next', 'start', '-p', process.env.PORT || '3000', '-H', '0.0.0.0'];
} else if (serviceName.includes('crm')) {
  console.log('[VYRO Launcher] Selected Target: CRM (Next.js)');
  workingDir = path.resolve(process.cwd(), 'apps/crm');
  command = 'npx';
  args = ['next', 'start', '-p', process.env.PORT || '3000', '-H', '0.0.0.0'];
} else {
  console.log('[VYRO Launcher] Selected Target: API (Fastify)');
  workingDir = process.cwd();
  command = 'node';
  args = ['apps/api/dist/main.js'];
}

console.log(`[VYRO Launcher] CWD: ${workingDir}`);
console.log(`[VYRO Launcher] Spawning: ${command} ${args.join(' ')}`);

const child = spawn(command, args, {
  cwd: workingDir,
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code, signal) => {
  console.log(`[VYRO Launcher] Child process exited with code ${code} signal ${signal}`);
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('[VYRO Launcher] Failed to spawn process:', err);
  process.exit(1);
});
