const HTTP = require('./libClient');

const userSessionGet = ({ token }) =>
  HTTP.get('/v1/user-session', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((err) => {
    console.log('userInfoGet failed', err.response.data);
    throw err;
  });

const userInfoGet = ({ token }) =>
  HTTP.get('/v1/user', {
    params: {
      expandPermissions: false,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      liveMode: false,
    },
  })
    .then(({ data, ...restResponse }) => {
      const { flags, ...restUser } = data;
      return {
        ...restResponse,
        data: {
          ...restUser,
          flags:
            flags.reduce(
              (result, { id, name, value }) => ({
                ...result,
                [name]: { id, value },
              }),
              {},
            ) || {},
        },
      };
    })
    .catch((err) => {
      console.log('userInfoGet failed', err.response.data);
      throw err;
    });

module.exports = { userSessionGet, userInfoGet };
