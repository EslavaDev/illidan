const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

const webpackConfigPath = require.resolve('../config/webpack/webpack.config');

function buildWebpack({ watch, mode }) {
  const webpackArgs = [
    'webpack',
    `--config=${webpackConfigPath}`,
    `--mode=${mode}`,
  ];
  webpackArgs.push(...(watch ? ['--watch'] : []));
  spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', webpackArgs, {
    env: {
      IS_BROWSER: true,
      PATH: process.env.PATH,
      ...process.env,
      NODE_ENV: mode,
    },
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

function buildWebpackDev({ watch }) {
  buildWebpack({ mode: 'development', watch });
}
async function buildWebpackClient() {
  await execPromise(
    `${/^win/.test(process.platform) ? 'npx.cmd' : 'npx'} rimraf public`,
  );
  buildWebpack({ mode: 'production' });
}

module.exports = { buildWebpackDev, buildWebpackClient };
