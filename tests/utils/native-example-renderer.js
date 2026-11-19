const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

async function withNativeRenderer(check) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ultralink-render-'));
  try {
    // Writes are relative to the script. Isolate them without mocking the
    // datasets, native exporters, or the CLI entry point.
    fs.mkdirSync(path.join(root, 'examples'));
    fs.copyFileSync(require.resolve('../../examples/render-examples.js'), path.join(root, 'examples', 'render-examples.js'));
    fs.symlinkSync(path.join(__dirname, '..'), path.join(root, 'tests'), 'junction');
    fs.symlinkSync(path.join(__dirname, '../../src'), path.join(root, 'src'), 'junction');

    const runNode = (...args) => execFileAsync(process.execPath, args, { cwd: root, timeout: 20000 });
    await check(root, runNode);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

module.exports = { withNativeRenderer };
