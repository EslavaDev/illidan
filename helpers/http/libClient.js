const { createHttpClient } = require('../../http');

module.exports = createHttpClient({
  retries: 2,
  baseURL: 'https://panelb.conektame.io',
});
