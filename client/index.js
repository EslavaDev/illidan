/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const React = require('react');
const ReactDOM = require('react-dom');
const { default: i18nBuilder } = require('i18next');
const { initReactI18next, useSSR } = require('react-i18next');
const {
  default: LanguageDetector,
} = require('i18next-browser-languagedetector');
const { loadableReady } = require('@loadable/component');

// eslint-disable-next-line no-undef,no-underscore-dangle
const { __I18N__: i18n, __PRELOADED_STATE__: state } = window;

const hydrate = (stateLoaderFn) => {
  const Component = stateLoaderFn(state);
  return i18nBuilder
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: i18n.language,
      fallbackLng: i18n.language,
      preload: [i18n.language],
      supportedLngs: [i18n.language],
      detection: {},
      resources: {},
      debug: false,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    })
    .then(() => {
      const InitSSR = () => {
        useSSR(i18n.store, i18n.language);
        return React.createElement(React.Fragment, {}, Component);
      };

      return loadableReady(() => {
        ReactDOM.hydrate(
          React.createElement(InitSSR),
          // eslint-disable-next-line no-undef
          document.getElementById('app'),
        );
      });
    });
};

module.exports = { hydrate };
