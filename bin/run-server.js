const { getLogPrefix } = require('../helpers/log');

function runServerLib({ entry }) {
  const logPrefixInfo = getLogPrefix('info');
  console.log(`${logPrefixInfo} Dev server started`);
}
