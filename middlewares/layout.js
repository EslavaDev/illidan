/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const React = require('react');
const path = require('path');
const ReactDOMServer = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');
const { isValidElementType } = require('react-is');
const { ChunkExtractor } = require('@loadable/server');
const serialize = require('serialize-javascript');
const { I18nextProvider } = require('react-i18next');
const { ScriptBundler } = require('../declarative/bundlers/scriptBundler');
// const { StyleBundler } = require('../declarative/bundlers/styleBundler');
// const { HeadBundler } = require('../declarative/bundlers/headBundler');

function layoutMiddleware(basePath) {
  return function (req, res, next) {
    const sheet = new ServerStyleSheet();
    res.reactRender = async (Component, { title, clientName }) => {
      const { i18n } = req;
      if (!isValidElementType(Component)) {
        const err = Error(
          'Render function only accepts valid React Element types',
        );
        next(err);
        return;
      }
      const statsFile = path.resolve(
        `${process.cwd()}/public/loadable-stats.json`,
      );
      const translation = i18n.store.data[i18n.language];
      const i18nClient = {
        store: { [i18n.language]: translation },
        language: i18n.language,
      };
      const extractor = new ChunkExtractor({
        statsFile,
        entrypoints: [clientName],
        publicPath: `${basePath}/static`,
      });
      const LngWrapper = () =>
        React.createElement(
          I18nextProvider,
          { i18n },
          React.createElement(Component),
        );
      const app = ReactDOMServer.renderToString(
        extractor.collectChunks(
          sheet.collectStyles(React.createElement(LngWrapper)),
        ),
      );
      const loadableScriptTags = extractor.getScriptTags();
      const loadableStyleTags = extractor.getStyleTags();

      const styleTags = sheet.getStyleTags();
      const scriptBundler = new ScriptBundler();
      // const styleBundler = new StyleBundler();
      const innerScripts = await scriptBundler.joinScripts();
      // const innerStyles = await styleBundler.joinStyles(basePath);
      // const headTags = HeadBundler.extendHead();
      const html = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
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
      res.header('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
      sheet.seal();
    };
    next();
  };
}

module.exports = { layoutMiddleware };
