const path = require('path');
// eslint-disable-next-line import/no-dynamic-require
const cronosConfig = require(path.resolve(process.cwd(), 'cronos.config'));
const helmet = require('helmet');

const extendCspHeaders = () => {
  const { extendCSP } = cronosConfig;
  let connectSrc = [];
  if (extendCSP && Array.isArray(extendCSP.connectSrc)) {
    connectSrc = extendCSP.connectSrc;
  }
  let scriptSrc = [];
  if (extendCSP && Array.isArray(extendCSP.scriptSrc)) {
    scriptSrc = extendCSP.scriptSrc;
  }
  let frameSrc = [];
  if (extendCSP && Array.isArray(extendCSP.frameSrc)) {
    frameSrc = extendCSP.frameSrc;
  }
  return helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          '*.conektame.io',
          '*.conekta.com',
          ...scriptSrc,
        ],
        'connect-src': [
          "'self'",
          'rum-http-intake.logs.datadoghq.com',
          ...connectSrc,
        ],
        'frame-src': ["'self'", ...frameSrc],
        'img-src': ["'self'", '*'],
      },
    },
  });
};

module.exports = {
  extendCspHeaders,
};
