const isAuthorized = (withPermissions) => (req, res, next) => {
  const { permissions } = req.user;
  const isUserAuthorized = withPermissions.every((permission) =>
    permissions.includes(permission),
  );
  if (!isUserAuthorized) {
    res.redirect(isAuthorized.defaults.redirectUrl);
    return;
  }
  next();
};

isAuthorized.defaults = {
  redirectUrl: '/',
};

module.exports = isAuthorized;
