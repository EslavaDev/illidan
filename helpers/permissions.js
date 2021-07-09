const UserTypesEnum = require('../enums/userTypes');

const isAdOpsUser = (userType) =>
  [
    UserTypesEnum.adOpsAdmin,
    UserTypesEnum.adOpsCommercialSuccessOperator,
    UserTypesEnum.adOpsCustomerSupport,
    UserTypesEnum.adOpsReadOnly,
  ].includes(userType);

const getUserActivitiesPermissions = (userHasActivityPermission) =>
  (userHasActivityPermission || []).reduce(
    (activitiesPermissionsAccumulator, { permissions }) => {
      // eslint-disable-next-line no-param-reassign
      activitiesPermissionsAccumulator =
        activitiesPermissionsAccumulator.concat(permissions);
      return activitiesPermissionsAccumulator;
    },
    [],
  );

module.exports = { getUserActivitiesPermissions, isAdOpsUser };
