/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const React = require('react');

if (process.env.IS_BROWSER) {
  module.exports = ({ className, children }) =>
    React.createElement('div', { className }, children);
} else {
  const serialize = require('serialize-javascript');
  const Script = require('../Script');
  const Page = ({ children, state, className }) =>
    React.createElement(
      'div',
      { className },
      state &&
        React.createElement(
          Script,
          {},
          `window.__PRELOADED_STATE__ = ${serialize(state, { isJSON: true })};`,
        ),
      children,
    );

  module.exports = Page;
}
