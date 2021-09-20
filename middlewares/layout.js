/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const { createElement, Fragment } = require('react');
const { renderToStaticMarkup, renderToString } = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');
const { isValidElementType } = require('react-is');
const { ChunkExtractor } = require('@loadable/server');
const serialize = require('serialize-javascript');
const { I18nextProvider } = require('react-i18next');

const { Helmet: ReactHelmet } = require('react-helmet');
const { getStatsFilePath } = require('../helpers/statsFile');

function SSRComponent({ children, i18n }) {
  return createElement(i18n ? I18nextProvider : Fragment, {
    i18n: i18n || null,
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

function buildComponentRenderer({ extractor, sheet, Component, i18n }) {
  if (!extractor) {
    return sheet.collectStyles(
      createElement(SSRComponent, { i18n }, createElement(Component)),
    );
  }
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
  const helmetTags = ReactHelmet.renderStatic();
  let i18nClient;
  if (i18n) {
    const translation = i18n.store.data;
    i18nClient = {
      store: translation,
      language: i18n.language,
    };
  }
  // Collect scripts
  const loadableScriptTags = extractor.getScriptTags();

  // Collect styles
  const loadableStyleTags = extractor.getStyleTags();
  const styleTags = sheet.getStyleTags();

  sheet.seal();

  const langAttr = i18n && i18n.language ? `lang="${i18n.language}"` : '';

  return `
<!doctype html>
<html ${langAttr} ${helmetTags.htmlAttributes.toString()}>
<head>
    ${getHeadMetaTags({ title })}
    <title>${title}</title>
    ${styleTags}
    ${loadableStyleTags}
    ${helmetTags.meta.toString()}
    ${helmetTags.link.toString()}
    ${helmetTags.style.toString()}
</head>
<body ${helmetTags.bodyAttributes.toString()}>
    <div id="app">${app}</div>
    <script>(function(){window.__I18N__ = ${
      i18nClient ? serialize(i18nClient) : null
    }}).apply(window)</script>
    ${loadableScriptTags}
    ${helmetTags.script.toString()}
</body>
</html>`;
}

function renderStatic({ i18n, clientName, basePath, Component, title }) {
  const statsPath = getStatsFilePath();
  let extractor;
  let loadableStyleTags = '';
  if (clientName) {
    extractor = getChunkExtractor({ statsPath, clientName, basePath });
    loadableStyleTags = extractor.getStyleTags();
  }
  const sheet = new ServerStyleSheet();
  const app = renderToStaticMarkup(
    buildComponentRenderer({ extractor, sheet, Component, i18n }),
  );
  const helmetTags = ReactHelmet.renderStatic();

  // Collect styled component tags
  const styledComponentsTags = sheet.getStyleTags();

  sheet.seal();

  const langAttr = i18n && i18n.language ? `lang="${i18n.language}"` : '';
  return `
<!doctype html>
<html ${langAttr} ${helmetTags.htmlAttributes.toString()}>
<head>
    ${getHeadMetaTags({ title })}
    <title>${title}</title>
    ${styledComponentsTags}
    ${loadableStyleTags}
    ${helmetTags.meta.toString()}
    ${helmetTags.link.toString()}
    ${helmetTags.style.toString()}
</head>
<body ${helmetTags.bodyAttributes.toString()}>
    <div id="app">${app}</div>
    ${helmetTags.script.toString()}
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
