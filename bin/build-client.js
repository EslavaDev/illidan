const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

const webpackConfigPath = require.resolve('../config/webpack/webpack.config');

function buildWebpack({ watch, mode, serve }) {
  const webpackArgs = ['webpack'];
  const env = {
    IS_BROWSER: true,
    PATH: process.env.PATH,
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
  if (serve) {
    webpackArgs.push('serve');
    env.CRONOS_SERVE_SPA = true;
  }
  if (watch) {
    webpackArgs.push('--watch');
  }
  webpackArgs.push(...[`--config=${webpackConfigPath}`, `--mode=${mode}`]);
  spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', webpackArgs, {
    env,
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

function serveWebpackDev({ mode }) {
  buildWebpack({ mode, serve: true });
}
async function buildWebpackClient({ watch, mode }) {
  if (mode === 'production') {
    await execPromise(
      `${/^win/.test(process.platform) ? 'npx.cmd' : 'npx'} rimraf public`,
    );
  }
  buildWebpack({ mode, watch });
}

module.exports = { serveWebpackDev, buildWebpackClient };
