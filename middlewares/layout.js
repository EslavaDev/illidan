/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const { createElement } = require('react');
const path = require('path');
const { renderToStaticMarkup, renderToString } = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');
const { isValidElementType } = require('react-is');
const { ChunkExtractor } = require('@loadable/server');
const serialize = require('serialize-javascript');
const { I18nextProvider } = require('react-i18next');
const { ScriptBundler } = require('../declarative/bundlers/scriptBundler');

function SSRComponent({ children, i18n }) {
  return createElement(I18nextProvider, {
    i18n,
    children,
  });
}

function getChunkExtractor({ statsPath, clientName, basePath }) {
  return new ChunkExtractor({
    statsFile: statsPath,
    entrypoints: [clientName],
    publicPath: `${basePath}/static`,
  });
}

function getHeadMetaTags({ title }) {
  return `
    <meta charSet="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <meta name="HandheldFriendly" content="true"/>
      <meta name="application-name" content="${title}"/>
      <meta http-equiv="X-UA-Compatible" content="ie=edge">`;
}

function getStatsFilePath() {
  return path.resolve(`${process.cwd()}/public/loadable-stats.json`);
}

function buildComponentRenderer({ extractor, sheet, Component, i18n }) {
  return extractor.collectChunks(
    sheet.collectStyles(
      createElement(SSRComponent, { i18n }, createElement(Component)),
    ),
  );
}

function renderHydrate({ i18n, clientName, basePath, Component, title }) {
  const statsPath = getStatsFilePath();
  const extractor = getChunkExtractor({ statsPath, clientName, basePath });
  const sheet = new ServerStyleSheet();
  const app = renderToString(
    buildComponentRenderer({ extractor, sheet, Component, i18n }),
  );
  const translation = i18n.store.data[i18n.language];
  const i18nClient = {
    store: { [i18n.language]: translation },
    language: i18n.language,
  };
  // Collect scripts
  const loadableScriptTags = extractor.getScriptTags();
  const innerScripts = new ScriptBundler().joinScripts();

  // Collect styles
  const loadableStyleTags = extractor.getStyleTags();
  const styleTags = sheet.getStyleTags();

  sheet.seal();

  return `
<!doctype html>
<html lang="${i18n.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta name="HandheldFriendly" content="true"/> 
    <meta name="application-name" content="${title}" /> 
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
    ${styleTags}
    ${loadableStyleTags}
</head>
<body>
    <div id="app">${app}</div>
    <script>(function(){window.__I18N__ = ${serialize(
      i18nClient,
    )}}).apply(window)</script>
    ${innerScripts}
    ${loadableScriptTags}
</body>
</html>`;
}

function renderStatic({ i18n, clientName, basePath, Component, title }) {
  const statsPath = getStatsFilePath();
  const extractor = getChunkExtractor({ statsPath, clientName, basePath });
  const sheet = new ServerStyleSheet();
  const app = renderToStaticMarkup(
    buildComponentRenderer({ extractor, sheet, Component, i18n }),
  );

  // Collect styles
  const loadableStyleTags = extractor.getStyleTags();
  const styleTags = sheet.getStyleTags();

  sheet.seal();
  return `
<!doctype html>
<html lang="${i18n.language}">
<head>
    ${getHeadMetaTags({ title })}
    <title>${title}</title>
    ${styleTags}
    ${loadableStyleTags}
</head>
<body>
    <div id="app">${app}</div>
</body>
</html>`;
}

function layoutMiddleware(basePath) {
  return function (req, res, next) {
    res.reactRender = async (
      Component,
      { title, clientName, toStaticMarkup },
    ) => {
      const { i18n } = req;
      if (!isValidElementType(Component)) {
        const err = Error(
          'Render function only accepts valid React Element types',
        );
        next(err);
        return;
      }
      const renderFn = toStaticMarkup ? renderStatic : renderHydrate;
      const html = renderFn({ i18n, clientName, basePath, Component, title });
      res.header('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    };
    next();
  };
}

module.exports = { layoutMiddleware };
