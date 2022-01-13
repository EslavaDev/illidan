const crypto = require('crypto');
const { v4 } = require('uuid');

function nonceMiddleware(req, res, next) {
  const hash = crypto.createHash('sha256');
  hash.update(v4());
  const nonce = hash.digest('base64');
  req.nonce = nonce;
  next();
}

module.exports = { nonceMiddleware };
