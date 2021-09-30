const env = process.env.NODE_ENV || 'development';

const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${env}`),
});

module.exports = env;
