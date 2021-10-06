// eslint-disable-next-line node/no-unpublished-require
const fse = require('fs-extra');
const { getStatsFilePath } = require('../helpers/statsFile');
const { getLogPrefix } = require('../helpers/log');

async function redirectToAssetMiddleware() {
  const file = getStatsFilePath();
  let statsFile = null;
  if (await fse.exists(file)) {
    // eslint-disable-next-line import/no-dynamic-require
    statsFile = require(file);
  } else {
    console.log(
      `${getLogPrefix(
        'warn',
      )} Cannot find client stats file, chunkMiddleware will be disabled`,
    );
  }
  return function (req, res, next) {
    if (!statsFile) {
      next();
      return;
    }
    res.sendJsAsset = (chunkName) => {
      if (!statsFile.assetsByChunkName[chunkName]) {
        next(Error('Related Asset Not found'));
      }
      const assetFileName = statsFile.assetsByChunkName[chunkName].find(
        (asset) => asset.endsWith('.js'),
      );
      if (!assetFileName) {
        next(Error('Related Js Asset Not found'));
      }
      res.sendFile(`${process.cwd()}/public/${assetFileName}`);
    };
    next();
  };
}

module.exports = {
  redirectToChunkMiddleware: redirectToAssetMiddleware,
};
