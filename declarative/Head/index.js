/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

if (process.env.IS_BROWSER) {
  module.exports = () => null;
} else {
  module.exports = require('react-helmet').default;
}
