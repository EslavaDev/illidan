// eslint-disable-next-line import/order
const env = require('./env');
const { resolve } = require('path');
const { handle } = require('i18next-http-middleware');
const i18next = require('i18next');
const chalk = require('chalk');
const { LogRoute } = require('./middlewares/logRoute');
const express = require('./server');
const { initI18n } = require('./i18n/_server');
const { getLogPrefix } = require('./helpers/log');
const { createDevServer } = require('./helpers/devServer');
const { extendCspHeaders } = require('./helpers/cspHeaders');

function handleFatalError(err) {
  console.log(`${getLogPrefix('error')} Unhandled Error - ${err.message}`);
  console.error(chalk.red(err.stack));
}

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);

const initApp = ({ appRouter, apiRouter, i18n, onlyServer }) => {
  const basePath = process.env.APP_BASE_PATH || '';
  const port = process.env.NODE_PORT;
  if (!port) {
    throw Error(`Port not provided in: process.env.NODE_PORT`);
  }
  if (!port) {
    throw Error(`App base path not provided in: process.env.APP_BASE_PATH`);
  }

  const app = express();

  app.use(extendCspHeaders());
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
  if (!onlyServer) {
    const {
      redirectToChunkMiddleware,
    } = require('./middlewares/redirectToChunk');
    app.use(redirectToChunkMiddleware(basePath));
  }
  if (i18n) {
    initI18n(i18n);
    app.use(handle(i18next));
  }
  if (appRouter) {
    if (!onlyServer) {
      app.use(
        basePath,
        require('./middlewares/layout').layoutMiddleware(basePath),
        appRouter,
      );
    } else {
      app.use(basePath, appRouter);
    }
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
