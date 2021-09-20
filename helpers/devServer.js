const fs = require('fs');
const { resolve } = require('path');
const https = require('https');

function createDevServer(app) {
  const devServerOptions = {
    key: fs.readFileSync(resolve(__dirname, '../config/cert/my_cert.key')),
    cert: fs.readFileSync(resolve(__dirname, '../config/cert/my_cert.crt')),
  };
  return https.createServer(devServerOptions, app);
}

module.exports = {
  createDevServer,
};
