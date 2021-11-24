const path = require('path');
// eslint-disable-next-line import/no-dynamic-require
const cronosConfig = require(path.resolve(process.cwd(), 'cronos.config'));
const helmet = require('helmet');

const extendCspHeaders = () => {
  const { extendCSP } = cronosConfig || { extendCSP: null };
  const { connectSrc, scriptSrc, frameSrc } = extendCSP || {
    connectSrc: [],
    frameSrc: [],
    scriptSrc: [],
  };

  return helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          '*.conektame.io',
          '*.conekta.com',
          'www.googletagmanager.com',
          ...scriptSrc,
        ],
        'connect-src': [
          "'self'",
          'rum-http-intake.logs.datadoghq.com',
          'www.google-analytics.com',
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
