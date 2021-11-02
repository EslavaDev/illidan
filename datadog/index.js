const { resolve } = require('path');

const appRoot = process.cwd();

// eslint-disable-next-line import/no-dynamic-require
const { version } = require(resolve(appRoot, 'package.json'));
const { getLogPrefix } = require('../helpers/log');
const logger = require('../logger');

const init = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return;
  }
  require('dd-trace').init({
    logInjection: true,
    version,
    env: process.env.NODE_ENV,
  });

  require('source-map-support').install();

  const logPrefixInfo = getLogPrefix('info');
  logger.info(`${logPrefixInfo} Production server started`);
};

module.exports = init;
