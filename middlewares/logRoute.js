/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const chalk = require('chalk');
const { getLogPrefix } = require('../helpers/log');

function LogRoute(req, res, next) {
  if (!req.originalUrl.includes('static')) {
    console.log(
      `${getLogPrefix('info')} ${chalk.gray(
        '[route-logger]',
      )} : ${chalk.greenBright(`[${req.method}]`)}`,
      req.url,
    );
  }
  next();
}

module.exports = { LogRoute };
