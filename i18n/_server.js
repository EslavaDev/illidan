/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const i18n = require('i18next');
const { LanguageDetector } = require('i18next-http-middleware');

function initI18n(i18nConfig) {
  if (!i18nConfig) {
    return;
  }
  const { locales, langs, defaultLang } = i18nConfig;
  // eslint-disable-next-line consistent-return
  return i18n.use(LanguageDetector).init({
    lng: defaultLang,
    fallbackLng: defaultLang,
    preload: langs,
    supportedLngs: langs,
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie'],
      lookupQuerystring: 'locale',
      lookupCookie: 'locale',
      ignoreCase: true,
      cookieSecure: true,
    },
    resources: locales,
  });
}

module.exports = { initI18n };
