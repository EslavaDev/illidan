/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const { createElement } = require('react');

if (process.env.IS_BROWSER) {
  module.exports = ({ className, children }) =>
    createElement('div', { className }, children);
} else {
  const withSideEffect = require('react-side-effect');
  const reducePropsToState = (propsList) =>
    propsList.length ? propsList[0].state : null;
  const Page = ({ children, className }) =>
    createElement('div', { className }, children);

  module.exports = withSideEffect(reducePropsToState, () => {})(Page);
}
