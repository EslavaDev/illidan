/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const { createInterceptor } = require('@mswjs/interceptors');
const { headersToObject, objectToHeaders } = require('headers-utils');
const {
  interceptClientRequest,
} = require('@mswjs/interceptors/lib/interceptors/ClientRequest');
const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { isMatch } = require('matcher');
const { getLogPrefix } = require('../helpers/log');

function safeParseJson(string) {
  try {
    return JSON.parse(string);
  } catch {
    return string;
  }
}

function getMockPath(req) {
  const env = process.env.NODE_ENV || 'development';
  const { method } = req;
  const { protocol, host, pathname } = req.url;
  const sanitizedProtocol = protocol.replace(':', '');
  const pathParts = pathname.split('/');
  const lastPathPart = pathParts.pop();
  return `mocks/${env}/${method.toLowerCase()}/${sanitizedProtocol}/${host}${pathParts.join(
    '/',
  )}/${lastPathPart}.json`;
}

let interceptor;

function restore() {
  if (!interceptor) {
    return;
  }
  interceptor.restore();
  interceptor = null;
}

function initMocks(interceptRoutes) {
  if (!interceptRoutes) {
    throw Error('Intercept routes regex required');
  }
  // eslint-disable-next-line no-param-reassign
  interceptRoutes = Array.isArray(interceptRoutes)
    ? interceptRoutes
    : [interceptRoutes];
  interceptor = createInterceptor({
    modules: [interceptClientRequest],
    async resolver(request) {
      if (!isMatch(request.url.href, interceptRoutes)) {
        return;
      }
      const mockPath = getMockPath(request);
      const exist = await fse.pathExists(mockPath);
      if (!exist) {
        return;
      }
      console.log(
        `${getLogPrefix('info')} ${chalk.gray(
          '[dev-mocks]',
        )} : ${chalk.blueBright('Reading mock from: ')}`,
        mockPath,
      );
      try {
        const { headers, status, statusText, body } = await fse.readJson(
          mockPath,
        );
        const buildHeaders = objectToHeaders(headers);
        const buildBody = JSON.stringify(body);
        // eslint-disable-next-line consistent-return
        return {
          status,
          statusText,
          headers: buildHeaders,
          body: buildBody,
        };
      } catch (e) {
        console.error(chalk.bgRed.white('Error reading mock file'), e);
      }
    },
  });

  interceptor.on('response', async (req, res) => {
    if (!isMatch(req.url.href, interceptRoutes)) {
      return;
    }
    const { status, statusText, body, headers } = res;
    const objectHeaders = headersToObject(headers);
    const objectBody = safeParseJson(body);
    const JsonObj = {
      status,
      statusText,
      headers: objectHeaders,
      body: objectBody,
    };
    const mockRoute = getMockPath(req);
    const exist = await fse.pathExists(mockRoute);
    if (exist) {
      return;
    }
    try {
      await fse.outputFile(
        path.resolve(process.cwd(), mockRoute),
        JSON.stringify(JsonObj, null, 2),
        'utf8',
      );
      console.log(chalk.bgGreen.white('Mock created in: '), mockRoute);
    } catch (err) {
      console.error(chalk.bgRed.white('Error creating mock file'), err);
      console.error(
        chalk.bgRed.white('Path filed: '),
        path.resolve(process.cwd(), mockRoute),
      );
    }
  });

  interceptor.apply();
}

process.on('disconnect', () => {
  restore();
});

module.exports = {
  initMocks,
  restore,
};
