const { spawn } = require('child_process');
const { getLogPrefix } = require('../helpers/log');
const logger = require('../logger');

function runTests({ env }) {
  const logPrefixInfo = getLogPrefix('info');
  logger.info(`${logPrefixInfo} Runing test on ${env || 'client'} mode...`);
  const jestConfig = require.resolve('../config/jest/jest.config');

  const jestArgs = ['jest', '-c', jestConfig];

  const spawnConfig = {
    env: {
      PATH: process.env.PATH,
      IS_BROWSER: false,
      ...process.env,
      NODE_ENV: 'test',
      CRONOS_TEST_ENV: env,
    },
    cwd: process.cwd(),
    stdio: 'inherit',
  };

  spawn(
    /^win/.test(process.platform) ? 'npx.cmd' : 'npx',
    jestArgs,
    spawnConfig,
  );
}

module.exports = {
  runTests,
};
