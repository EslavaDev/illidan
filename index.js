// eslint-disable-next-line import/order
const nodeEnv = require('./env');
require('./datadog')(nodeEnv);
const { resolve } = require('path');
const { handle } = require('i18next-http-middleware');
const i18next = require('i18next');
const chalk = require('chalk');
const { LogRoute } = require('./middlewares/logRoute');
const express = require('./server');
const { initI18n } = require('./i18n/_server');
const { createDevServer } = require('./helpers/devServer');
const { extendCspHeaders } = require('./helpers/cspHeaders');
const logger = require('./logger');
const { versionApplication } = require('./middlewares/version');

function handleFatalError(err) {
  logger.error(`Unhandled Error - ${err.message}`);
  logger.error(chalk.red(err.stack));
}

process.on('uncaughtException', handleFatalError);
process.on('unhandledRejection', handleFatalError);

const initApp = async ({ appRouter, apiRouter, i18n, onlyServer }) => {
  const basePath = process.env.APP_BASE_PATH || '';
  const port = process.env.NODE_PORT;
  if (!port) {
    throw Error(`Port not provided in: process.env.NODE_PORT`);
  }
  if (!port) {
    throw Error(`App base path not provided in: process.env.APP_BASE_PATH`);
  }

  const app = express();
  const cacheStatics = {
    etag: true,
    maxAge: '5m',
    cacheControl: nodeEnv !== 'development',
  };

  if (!onlyServer) {
    app.use(require('./middlewares/nonce').nonceMiddleware);
  }

  app.use(extendCspHeaders());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  app.use(express.json());

  app.set('trust proxy', 1);

  if (process.env.NODE_ENV === 'development') {
    app.use(LogRoute);
  }

  app.get(`${basePath}/ping`, versionApplication, (req, res) =>
    res.json(req.ping),
  );
  app.use(
    `${basePath}/static`,
    express.static(resolve(`${process.cwd()}/public`), cacheStatics),
  );
  if (!onlyServer) {
    const {
      redirectToChunkMiddleware,
    } = require('./middlewares/redirectToChunk');
    app.use(await redirectToChunkMiddleware(basePath));
  }
  if (i18n) {
    initI18n(i18n);
    app.use(handle(i18next));
  }
  if (apiRouter) {
    app.use(`${basePath}/api`, apiRouter);
  }

  if (appRouter) {
    if (!onlyServer) {
      app.use(require('./middlewares/deviceDetect').DeviceDetectMiddleware);
      app.use(
        basePath,
        require('./middlewares/layout').layoutMiddleware(basePath),
        appRouter,
      );
    } else {
      app.use(basePath, appRouter);
    }
  }
  const server = nodeEnv === 'development' ? createDevServer(app) : app;

  server.listen(port, () => {
    logger.info(`Listening on port ${chalk.greenBright(port)}`);
  });
};

module.exports = (config) => {
  initApp(config);
};
