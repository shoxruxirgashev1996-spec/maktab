const { spawn } = require('child_process');

const child = spawn('npm', ['run', 'start', '--workspace=backend'], {
  stdio: 'inherit',
  shell: false,
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start backend:', err);
  process.exit(1);
});
