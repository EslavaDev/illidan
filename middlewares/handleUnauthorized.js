/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const { UNAUTHORIZED } = require('http-status-codes');

function handleUnauthorizedErrors() {
  return function (error, req, res, next) {
    if (error.response && error.response.status === UNAUTHORIZED) {
      res.redirect('/unauthorized');
      return;
    }
    next(error);
  };
}

module.exports = handleUnauthorizedErrors;
