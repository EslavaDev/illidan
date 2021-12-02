const { createElement, Fragment } = require('react');
const { renderToStaticMarkup, renderToString } = require('react-dom/server');
const { isValidElementType } = require('react-is');
const { ChunkExtractor } = require('@loadable/server');
const { I18nextProvider } = require('react-i18next');

const { getStatsFilePath } = require('../helpers/statsFile');
const {
  buildPreLayoutAttributes,
  buildPostLayoutAttributes,
} = require('../helpers/layout');
const { buildCommonHtml } = require('../helpers/htmlBuilder');

const analyticID = process.env.GOOGLE_ANALYTICS_ID;

function SSRComponent({ children, i18n }) {
  const props = {};
  if (i18n) {
    props.i18n = i18n;
  }
  return createElement(i18n ? I18nextProvider : Fragment, props, children);
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

function renderHydrate({
  i18n,
  clientName,
  basePath,
  Component,
  title,
  nonce,
}) {
  const statsPath = getStatsFilePath();
  const extractor = getChunkExtractor({ statsPath, clientName, basePath });
  const { langAttr, sheet } = buildPreLayoutAttributes(extractor, i18n);

  const app = renderToString(
    buildComponentRenderer({ extractor, sheet, Component, i18n }),
  );

  const layoutAttributes = buildPostLayoutAttributes(extractor, sheet, nonce);

  let i18nClient;
  if (i18n) {
    const translation = i18n.store.data;
    i18nClient = {
      store: translation,
      language: i18n.language,
    };
  }

  const titleMetaTag = getHeadMetaTags({ title });
  return buildCommonHtml({
    langAttr,
    app,
    titleMetaTag,
    title,
    analyticID,
    i18nClient,
    nonce,
    ...layoutAttributes,
  });
}

function renderStatic({ i18n, clientName, basePath, Component, title, nonce }) {
  const statsPath = getStatsFilePath();
  const extractor =
    clientName && getChunkExtractor({ statsPath, clientName, basePath });

  const { langAttr, sheet } = buildPreLayoutAttributes(extractor, i18n);

  const app = renderToStaticMarkup(
    buildComponentRenderer({ extractor, sheet, Component, i18n }),
  );

  const layoutAttributes = buildPostLayoutAttributes(extractor, sheet, nonce);

  const titleMetaTag = getHeadMetaTags({ title });
  return buildCommonHtml({
    langAttr,
    app,
    titleMetaTag,
    title,
    analyticID,
    nonce,
    ...layoutAttributes,
  });
}

function layoutMiddleware(basePath) {
  return function (req, res, next) {
    res.reactRender = async (
      Component,
      { title, clientName, toStaticMarkup },
    ) => {
      const { i18n, nonce } = req;

      if (!isValidElementType(Component)) {
        const err = Error(
          'Render function only accepts valid React Element types',
        );
        next(err);
        return;
      }
      const renderFn = toStaticMarkup ? renderStatic : renderHydrate;
      const html = renderFn({
        i18n,
        clientName,
        basePath,
        Component,
        title,
        nonce,
      });
      res.header('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    };
    next();
  };
}

module.exports = { layoutMiddleware };
