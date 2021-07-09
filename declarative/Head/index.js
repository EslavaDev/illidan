/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

if (process.env.IS_BROWSER) {
  module.exports = () => null;
} else {
  const React = require('react');
  const withSideEffect = require('react-side-effect');
  const ReactDOMServer = require('react-dom/server');
  class LocalScript extends React.Component {
    render() {
      return null;
    }
  }

  const reducePropsToState = (propsList) => {
    if (propsList.length > 1) {
      throw Error('No multiple head allowed');
    }
    if (!propsList.length) {
      return '';
    }
    const { children } = propsList[0];
    return ReactDOMServer.renderToStaticMarkup(
      React.createElement(React.Fragment, null, children),
    );
  };

  const handleStateChangeOnClient = () => null;

  const mapStateOnServer = (scripts) => scripts;

  const Head = withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient,
    mapStateOnServer,
  )(LocalScript);

  module.exports = Head;
}
