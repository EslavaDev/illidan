const HTTP = require('./libClient');

const PERMISSIONS_SERVICE = '/v1/permission-service';

const userActivitiesPermissionsByEntityGet = ({ companyId, userId, token }) =>
  HTTP.get(
    `${PERMISSIONS_SERVICE}/user-permissions/${userId}/entities/${companyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

const userActivitiesPermissionsAdOpsGet = ({ userType, token }) =>
  HTTP.get(`${PERMISSIONS_SERVICE}/user-permissions/adops-role/${userType}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

module.exports = {
  userActivitiesPermissionsByEntityGet,
  userActivitiesPermissionsAdOpsGet,
};
