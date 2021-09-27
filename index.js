const env = process.env.NODE_ENV || 'development';

const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${env}`),
});
const { resolve } = require('path');

const helmet = require('helmet');
const { handle } = require('i18next-http-middleware');
const i18next = require('i18next');
const chalk = require('chalk');
const { LogRoute } = require('./middlewares/logRoute');
const { layoutMiddleware } = require('./middlewares/layout');
const express = require('./server');
const { initI18n } = require('./i18n/_server');
const { getLogPrefix } = require('./helpers/log');
const { redirectToChunkMiddleware } = require('./middlewares/redirectToChunk');
const { createDevServer } = require('./helpers/devServer');

function handleFatalError(err) {
  console.log(`${getLogPrefix('error')} Unhandled Error - ${err.message}`);
  console.error(chalk.red(err.stack));
}

// eslint-disable-next-line import/no-dynamic-require
const cronosConfig = require(path.resolve(process.cwd(), 'cronos.config'));

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);

const initApp = ({ appRouter, apiRouter, i18n }) => {
  const basePath = process.env.APP_BASE_PATH || '';
  const port = process.env.NODE_PORT;
  if (!port) {
    throw Error(`Port not provided in: process.env.NODE_PORT`);
  }
  if (!port) {
    throw Error(`App base path not provided in: process.env.APP_BASE_PATH`);
  }

  const app = express();

  const { extendCSP } = cronosConfig;
  let connectSrc = [];
  if (extendCSP && Array.isArray(extendCSP.connectSrc)) {
    connectSrc = extendCSP.connectSrc;
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            '*.conektame.io',
            '*.conekta.com',
          ],
          'connect-src': [
            "'self'",
            'rum-http-intake.logs.datadoghq.com',
            ...connectSrc,
          ],
          'img-src': [
            "'self'",
            '*.conektame.io',
            '*.conekta.com',
            's3-conektacdn-staging.s3.amazonaws.com',
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

  app.set('trust proxy', 1);

  app.use(LogRoute);

  app.get(`${basePath}/ping`, (_, res) => res.send('pong'));
  app.use(
    `${basePath}/static`,
    express.static(resolve(`${process.cwd()}/public`)),
  );
  app.use(redirectToChunkMiddleware(basePath));
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

  const server = env === 'development' ? createDevServer(app) : app;

  server.listen(port, () => {
    console.log(
      `${getLogPrefix('info')} Listening on port ${chalk.greenBright(port)}`,
    );
  });
};

module.exports = initApp;
