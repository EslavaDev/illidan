const path = require('path');
// eslint-disable-next-line import/no-dynamic-require
const illidanConfig = require(path.resolve(process.cwd(), 'illidan.config'));
const helmet = require('helmet');

const extendCspHeaders = () => {
  const { extendCSP } = illidanConfig || { extendCSP: null };
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
          'www.googletagmanager.com',
          ({ nonce }) => (nonce ? `'nonce-${nonce}'` : ''),
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
