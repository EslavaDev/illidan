/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const { ensureAuthenticated } = require('../oidc');

module.exports = ensureAuthenticated;
