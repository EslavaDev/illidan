const path = require('path');
require('dotenv').config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || 'development'}`,
  ),
});

const fs = require('fs');
const { resolve } = require('path');
const https = require('https');

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

function handleFatalError(err) {
  console.error(chalk.bgRed.white('UNHANDLED ERROR'), err.message);
  console.error(chalk.red(err.stack));
}

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

  app.set('trust proxy', 1);

  app.use(LogRoute);

  const options = {
    key: fs.readFileSync(resolve(__dirname, './config/cert/my_cert.key')),
    cert: fs.readFileSync(resolve(__dirname, './config/cert/my_cert.crt')),
  };
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

  const server = https.createServer(options, app);

  server.listen(port, () => {
    console.log(
      `${getLogPrefix('info')} Listening on port ${chalk.greenBright(port)}`,
    );
  });
};

module.exports = initApp;
