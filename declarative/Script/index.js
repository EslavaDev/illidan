/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

if (process.env.IS_BROWSER) {
  module.exports = () => null;
} else {
  const React = require('react');
  const withSideEffect = require('react-side-effect');

  class LocalScript extends React.Component {
    render() {
      return null;
    }
  }

  const reducePropsToState = (propsList) => {
    const scripts = {};
    propsList.forEach(({ src, children }) => {
      if (src) {
        throw Error('src is not supported');
      } else if (children) {
        let innerChildren;
        if (typeof children === 'function') {
          innerChildren = children.toString();
        } else {
          innerChildren = `(function(){${children}}).apply(window)`;
        }
        scripts[children] = {
          src: innerChildren,
          type: 'function',
        };
      }
    });
    return Object.keys(scripts).map((source) => scripts[source]);
  };

  const handleStateChangeOnClient = () => null;

  const mapStateOnServer = (scripts) => scripts;

  const Script = withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient,
    mapStateOnServer,
  )(LocalScript);

  module.exports = Script;
}
