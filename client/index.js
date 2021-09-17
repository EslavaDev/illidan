/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, node/no-extraneous-import, node/no-unsupported-features/es-syntax, import/no-extraneous-dependencies */

import { createElement, Fragment } from 'react';
import { hydrate as ReactDOMHydrate } from 'react-dom';
import i18nBuilder from 'i18next';
import { initReactI18next, useSSR } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { loadableReady } from '@loadable/component';
import { datadogRum } from '@datadog/browser-rum';

if (process.env.NODE_ENV !== 'development') {
  datadogRum.init({
    applicationId: process.env.DATADOG_APP_ID,
    clientToken: process.env.DATADOG_CLIENT_TOKEN,
    site: 'datadoghq.com',
    service: process.env.DATADOG_SERVICE,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: process.env.APP_VERSION,
    sampleRate: 100,
    trackInteractions: true,
    // eslint-disable-next-line no-restricted-globals,no-undef
    env: location.pathname,
  });
}

// eslint-disable-next-line no-undef,no-underscore-dangle
const { __I18N__: i18n, __PRELOADED_STATE__: state } = window;

// eslint-disable-next-line import/prefer-default-export
export const hydrate = (stateLoaderFn) => {
  const Component = stateLoaderFn(state);
  const mountComponent = () => {
    const InitSSR = () => {
      i18n && useSSR(i18n.store, i18n.language);
      return createElement(Fragment, {}, Component);
    };

    return loadableReady(() => {
      ReactDOMHydrate(
        createElement(InitSSR),
        // eslint-disable-next-line no-undef
        document.getElementById('app'),
      );
    });
  };
  if (!i18n) {
    return Promise.resolve(mountComponent());
  }
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
    .then(mountComponent);
};
