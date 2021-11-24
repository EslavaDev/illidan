const { resolve } = require('path');

const appRoot = process.cwd();

// eslint-disable-next-line import/no-dynamic-require
const { version } = require(resolve(appRoot, 'package.json'));
const { getLogPrefix } = require('../helpers/log');
const logger = require('../logger');

const init = (env) => {
  if (env === 'development') {
    return;
  }
  require('dd-trace').init({
    logInjection: true,
    version,
    env,
  });

  require('source-map-support').install();

  const logPrefixInfo = getLogPrefix('info');
  logger.info(`${logPrefixInfo} Production server started`);
};

module.exports = init;
