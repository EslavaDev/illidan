/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const axios = require('axios');
const axiosRetry = require('axios-retry');

const DEFAULT_TIMEOUT = 5000;

function createHttpClient(
  { retries, ...opts } = { timeout: DEFAULT_TIMEOUT, retries: 0 },
) {
  const instance = axios.create(opts);
  axiosRetry(instance, { retries });
  return instance;
}

module.exports = { createHttpClient };
