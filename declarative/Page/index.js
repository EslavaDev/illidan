/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const { createElement } = require('react');

if (process.env.IS_BROWSER) {
  module.exports = ({ className, children }) =>
    createElement('div', { className }, children);
} else {
  const serialize = require('serialize-javascript');
  const Script = require('../Script');
  const Page = ({ children, state, className }) =>
    createElement(
      'div',
      { className },
      state &&
        createElement(
          Script,
          {},
          `window.__PRELOADED_STATE__ = ${serialize(state, { isJSON: true })};`,
        ),
      children,
    );

  module.exports = Page;
}
