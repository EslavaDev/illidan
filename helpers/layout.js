const { Helmet: ReactHelmet } = require('react-helmet');
const serialize = require('serialize-javascript');
const { getServerStyleSheet } = require('./styledComponentsLoader');
const Page = require('../declarative/Page');

const ServerStyleSheet = getServerStyleSheet();

const buildPreLayoutAttributes = (extractor, i18n) => {
  const sheet = new ServerStyleSheet();

  const langAttr = i18n && i18n.language ? `lang="${i18n.language}"` : '';
  return {
    langAttr,
    sheet,
  };
};

const buildPostLayoutAttributes = (extractor, sheet, nonce) => {
  const { htmlAttributes, meta, link, style, script, bodyAttributes } =
    ReactHelmet.renderStatic();
  const pageState = Page.rewind();

  const preloadedStateTag = pageState
    ? `<script nonce="${nonce}">window.__PRELOADED_STATE__ = ${serialize(
        pageState,
        {
          isJSON: true,
        },
      )};</script>`
    : '';

  const helmetTags = {
    htmlAttributes: htmlAttributes.toString(),
    meta: meta.toString(),
    link: link.toString(),
    style: style.toString(),
    script: script.toString(),
    bodyAttributes: bodyAttributes.toString(),
  };
  // Collect scripts
  const loadableScriptTags = extractor
    ? extractor.getScriptTags({ nonce })
    : '';

  // Collect styles
  const loadableStyleTags = extractor ? extractor.getStyleTags() : '';
  const styleTags = sheet.getStyleTags();

  sheet.seal();

  return {
    helmetTags,
    loadableScriptTags,
    loadableStyleTags,
    styleTags,
    preloadedStateTag,
  };
};

module.exports = { buildPreLayoutAttributes, buildPostLayoutAttributes };
