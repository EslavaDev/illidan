const path = require('path');

function getStatsFilePath() {
  return path.resolve(`${process.cwd()}/public/loadable-stats.json`);
}

module.exports = {
  getStatsFilePath,
};
