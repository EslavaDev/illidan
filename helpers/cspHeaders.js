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
        'script-src': ["'self'", 'www.googletagmanager.com', ...scriptSrc],
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

const addNonceToCSP = (res, nonce) => {
  const headerName = 'Content-Security-Policy';
  const scriptSrc = 'script-src';
  const csp = String(res.getHeader(headerName));
  const newCsp = csp
    .split(';')
    .map((policy) => {
      if (!policy.startsWith(scriptSrc) || policy.split(' ')[0] !== scriptSrc) {
        return policy;
      }
      return `${policy} 'nonce-${nonce}'`;
    })
    .join(';');
  res.setHeader(headerName, newCsp);
};
module.exports = {
  extendCspHeaders,
  addNonceToCSP,
};
