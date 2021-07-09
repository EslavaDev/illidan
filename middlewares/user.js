/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const { UNAUTHORIZED } = require('http-status-codes');
const { userInfoGet, userSessionGet } = require('../helpers/http/user');
const { isCompletedCompany } = require('../helpers/company');

function userMiddleware() {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      res.redirect('/login');
      return;
    }
    const token = req.userContext.tokens.access_token;
    const sessionGet = userSessionGet({ token });
    const userByIdGet = userInfoGet({ token });
    Promise.all([sessionGet, userByIdGet])
      .then(([sessionResponse, userResponse]) => {
        req.user = userResponse.data;
        req.user.completedCompanies = req.user.entities.filter((company) =>
          isCompletedCompany(company),
        );
        req.sessionUrl = sessionResponse.data;
        next();
      })
      .catch((error) => {
        if (error.response && error.response.status === UNAUTHORIZED) {
          res.redirect('/unauthorized');
          return;
        }
        next(error);
      });
  };
}

module.exports = userMiddleware;
