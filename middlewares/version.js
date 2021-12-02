const { resolve } = require('path');

// eslint-disable-next-line import/no-dynamic-require
const { name, version } = require(resolve(process.cwd(), 'package.json'));

const versionApplication = (req, _res, next) => {
  req.ping = {
    name,
    version: `v${version}`,
  };
  next();
};

module.exports = { versionApplication };
