const crypto = require('crypto');
const { v4 } = require('uuid');

const nonceMiddleware = (req, res, next) => {
  const hash = crypto.createHash('sha256');
  hash.update(v4());
  const nonce = hash.digest('base64');

  req.nonce = nonce;

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

  next();
};

module.exports = {
  nonceMiddleware,
};
