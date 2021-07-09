/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const chalk = require('chalk');

function LogRoute(req, res, next) {
  if (!req.originalUrl.includes('static')) {
    console.log(chalk.bgGreen.white(`[${req.method}]`), req.url);
  }
  next();
}

module.exports = { LogRoute };
