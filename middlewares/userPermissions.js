/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const { UNAUTHORIZED } = require('http-status-codes');
const {
  getUserActivitiesPermissions,
  isAdOpsUser,
} = require('../helpers/permissions');
const {
  userActivitiesPermissionsAdOpsGet,
  userActivitiesPermissionsByEntityGet,
} = require('../helpers/http/permissions');

function userPermissionMiddleware() {
  return function (req, res, next) {
    const { user } = req;
    const { userType, completedCompanies, id: userId } = user;
    const token = req.userContext.tokens.access_token;
    let permissionsGet;
    if (isAdOpsUser(userType)) {
      permissionsGet = userActivitiesPermissionsAdOpsGet({ userType, token });
    } else {
      const { entityId } = req.params;
      const companyRequested = completedCompanies.find(
        ({ id }) => id === entityId,
      );
      if (companyRequested) {
        permissionsGet = userActivitiesPermissionsByEntityGet({
          companyId: entityId,
          userId: userId,
          token: token,
        });
      } else {
        res.redirect('/panel');
        return;
      }
    }
    permissionsGet
      .then((permissionsResponse) => {
        req.user.permissions = getUserActivitiesPermissions(
          permissionsResponse.data.activitiesPermissions,
        );
        next();
      })
      .catch((error) => next(error));
  };
}

module.exports = userPermissionMiddleware;
