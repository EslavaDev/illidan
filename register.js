const { getLogPrefix } = require('./helpers/log');
require('source-map-support').install();

const logPrefixInfo = getLogPrefix('info');
console.log(`${logPrefixInfo} Production server started`);
