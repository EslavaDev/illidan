// eslint-disable-next-line node/no-unpublished-require
const { getStatsFilePath } = require('../helpers/statsFile');

function redirectToAssetMiddleware() {
  // eslint-disable-next-line import/no-dynamic-require
  const statsFile = require(getStatsFilePath());
  return function (req, res, next) {
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
