const { Helmet: ReactHelmet } = require('react-helmet');
const { ServerStyleSheet } = require('styled-components');

const buildPreLayoutAttributes = (extractor, i18n) => {
  const sheet = new ServerStyleSheet();

  const langAttr = i18n && i18n.language ? `lang="${i18n.language}"` : '';
  return {
    langAttr,
    sheet,
  };
};

const buildPostLayoutAttributes = (extractor, sheet) => {
  const { htmlAttributes, meta, link, style, script, bodyAttributes } =
    ReactHelmet.renderStatic();
  const helmetTags = {
    htmlAttributes: htmlAttributes.toString(),
    meta: meta.toString(),
    link: link.toString(),
    style: style.toString(),
    script: script.toString(),
    bodyAttributes: bodyAttributes.toString(),
  };
  // Collect scripts
  const loadableScriptTags = extractor ? extractor.getScriptTags() : '';

  // Collect styles
  const loadableStyleTags = extractor ? extractor.getStyleTags() : '';
  const styleTags = sheet.getStyleTags();

  sheet.seal();

  return {
    helmetTags,
    loadableScriptTags,
    loadableStyleTags,
    styleTags,
  };
};

module.exports = { buildPreLayoutAttributes, buildPostLayoutAttributes };
