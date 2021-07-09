const ExpressOIDC = require('./ExpressOIDC');

const IDENTITY_CONF_URL_SERVER = 'https://identity.conektame.io';
const IDENTITY_CONF_URL_REDIR_DIR = '/signin-oidc';
const IDENTITY_CONF_URL_REDIR = 'https://dev.conektame.io:9090';

module.exports = new ExpressOIDC({
  issuer: IDENTITY_CONF_URL_SERVER,
  response_type: 'id_token token',
  response_mode: 'form_post',
  client_id: 'a12ba92e-42b8-4529-9634-491743a4666c',
  appBaseUrl: IDENTITY_CONF_URL_REDIR,
  scope: 'openid profile status cpanel-gateway-api onboarding-gateway-api',
  routes: {
    loginCallback: {
      path: IDENTITY_CONF_URL_REDIR_DIR,
    },
  },
});
