const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

const fs = require('fs');
const { resolve } = require('path');
const https = require('https');

const session = require('express-session');
const helmet = require('helmet');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const { handle } = require('i18next-http-middleware');
const i18next = require('i18next');
const chalk = require('chalk');
const oidc = require('./oidc');
const { LogRoute } = require('./middlewares/logRoute');
const { layoutMiddleware } = require('./middlewares/layout');
const express = require('./server');
const { initI18n } = require('./i18n/_server');
const { getLogPrefix } = require('./helpers/log');

function handleFatalError(err) {
  console.error(chalk.bgRed.white('UNHANDLED ERROR'), err.message);
  console.error(chalk.red(err.stack));
}

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);

const initApp = ({ enableOidcRoutes, appRouter, apiRouter, i18n }) => {
  const basePath = process.env.APP_BASE_PATH;
  const port = process.env.NODE_PORT;
  if (!port) {
    throw Error(`Port not provided in: process.env.NODE_PORT`);
  }
  if (!port) {
    throw Error(`App base path not provided in: process.env.APP_BASE_PATH`);
  }

  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-inline'", 'conektame.io'],
          'connect-src': ["'self'", 'rum-http-intake.logs.datadoghq.com'],
          'img-src': [
            "'self'",
            'https://s3-conektacdn-staging.s3.amazonaws.com',
          ],
        },
      },
    }),
  );
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  app.use(express.json());

  const redisClient = redis.createClient(6379);

  app.set('trust proxy', 1);

  app.use(
    session({
      secret: 'this-should-be-very-random',
      resave: true,
      saveUninitialized: false,
      store: new RedisStore({ client: redisClient }),
      cookie: { secure: true },
    }),
  );

  app.use(LogRoute);

  const options = {
    key: fs.readFileSync(resolve(__dirname, './config/cert/my_cert.key')),
    cert: fs.readFileSync(resolve(__dirname, './config/cert/my_cert.crt')),
  };

  oidc.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  oidc.on('ready', (sessionRouter, oidcRoutesRouter, errCastRouter) => {
    app.use(sessionRouter);
    if (enableOidcRoutes) {
      app.use(oidcRoutesRouter);
    }
    app.use(errCastRouter);
    app.get(`${basePath}/ping`, (_, res) => res.send('pong'));
    app.use(
      `${basePath}/static`,
      express.static(resolve(`${process.cwd()}/public`)),
    );
    if (i18n) {
      initI18n(i18n);
      app.use(handle(i18next));
    }
    if (appRouter) {
      app.use(basePath, layoutMiddleware(basePath), appRouter);
    }
    if (apiRouter) {
      app.use(`${basePath}/api`, apiRouter);
    }

    const server = https.createServer(options, app);

    server.listen(port, () => {
      console.log(
        `${getLogPrefix('info')} Listening on port ${chalk.greenBright(port)}`,
      );
    });
  });
};

module.exports = initApp;
