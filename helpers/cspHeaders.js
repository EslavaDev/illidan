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
  return helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          '*.conektame.io',
          '*.conekta.com',
        ],
        'connect-src': [
          "'self'",
          'rum-http-intake.logs.datadoghq.com',
          ...connectSrc,
        ],
        'img-src': ["'self'", '*'],
      },
    },
  });
};

module.exports = {
  extendCspHeaders,
};
