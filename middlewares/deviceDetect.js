const { parseUserAgent } = require('../device/parse');
const { buildSelectors } = require('../device/selectors');

const DeviceDetectMiddleware = (req, res, next) => {
  const UAHelper = parseUserAgent(req.headers['user-agent']);
  req.device = buildSelectors(UAHelper);
  next();
};

module.exports = { DeviceDetectMiddleware };
