const { createElement, Fragment } = require('react');
const { renderToStaticMarkup, renderToString } = require('react-dom/server');
const { isValidElementType } = require('react-is');
const { ChunkExtractor } = require('@loadable/server');
const serialize = require('serialize-javascript');
const { I18nextProvider } = require('react-i18next');

const { getStatsFilePath } = require('../helpers/statsFile');
const {
  buildPreLayoutAttributes,
  buildPostLayoutAttributes,
} = require('../helpers/layout');

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

function renderHydrate({ i18n, clientName, basePath, Component, title }) {
  const statsPath = getStatsFilePath();
  const extractor = getChunkExtractor({ statsPath, clientName, basePath });
  const { langAttr, sheet } = buildPreLayoutAttributes(extractor, i18n);

  const app = renderToString(
    buildComponentRenderer({ extractor, sheet, Component, i18n }),
  );

  const { helmetTags, loadableStyleTags, styleTags, loadableScriptTags } =
    buildPostLayoutAttributes(extractor, sheet);

  let i18nClient;
  if (i18n) {
    const translation = i18n.store.data;
    i18nClient = {
      store: translation,
      language: i18n.language,
    };
  }

  return `
<!doctype html>
<html ${langAttr} ${helmetTags.htmlAttributes}>
<head>
    ${getHeadMetaTags({ title })}
    <title>${title}</title>
    ${styleTags}
    ${loadableStyleTags}
    ${helmetTags.meta}
    ${helmetTags.link}
    ${helmetTags.style}
</head>
<body ${helmetTags.bodyAttributes}>
    <div id="app">${app}</div>
    <script>(function(){window.__I18N__ = ${
      i18nClient ? serialize(i18nClient) : null
    }}).apply(window)</script>
    ${helmetTags.script}
    ${loadableScriptTags}
</body>
</html>`;
}

function renderStatic({ i18n, clientName, basePath, Component, title }) {
  const statsPath = getStatsFilePath();
  const extractor =
    clientName && getChunkExtractor({ statsPath, clientName, basePath });

  const { langAttr, sheet } = buildPreLayoutAttributes(extractor, i18n);

  const app = renderToStaticMarkup(
    buildComponentRenderer({ extractor, sheet, Component, i18n }),
  );

  const { helmetTags, loadableStyleTags, styleTags } =
    buildPostLayoutAttributes(extractor, sheet);

  return `
<!doctype html>
<html ${langAttr} ${helmetTags.htmlAttributes}>
<head>
    ${getHeadMetaTags({ title })}
    <title>${title}</title>
    ${styleTags}
    ${loadableStyleTags}
    ${helmetTags.meta}
    ${helmetTags.link}
    ${helmetTags.style}
</head>
<body ${helmetTags.bodyAttributes}>
    <div id="app">${app}</div>
    ${helmetTags.script}
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
