module.exports = {
  isAuthorized: require('./isAuthorized'),
  ensureAuthenticated: require('./ensureAuthenticated'),
  applyUserPermissions: require('./userPermissions'),
  logoutAndRevoke: require('./logoutAndRevoke'),
  user: require('./user'),
  handleUnauthorizedErrors: require('./handleUnauthorized'),
};
