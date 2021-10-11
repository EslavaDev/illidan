const chalk = require('chalk');

const cliName = '[cronos-cli]';

const variants = {
  info: chalk.blueBright('i'),
  warn: chalk.hex('#FFA500')('w'),
  success: chalk.greenBright('s'),
  error: chalk.redBright('e'),
};

const getLogPrefix = (variant) =>
  `${variants[variant]} ${chalk.gray(cliName)} :`;

module.exports = { getLogPrefix, variants };
