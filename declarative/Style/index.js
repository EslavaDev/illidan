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
    propsList.forEach(({ src }) => {
      if (src) {
        const sources = [];
        if (Array.isArray(src)) {
          sources.push(...src);
        } else {
          sources.push(src);
        }
        sources.forEach((source) => {
          if (!scripts[source]) {
            scripts[source] = {
              src: source,
              type: 'source',
            };
          }
        });
      }
    });
    return Object.keys(scripts).map((source) => scripts[source]);
  };

  const handleStateChangeOnClient = () => null;

  const mapStateOnServer = (scripts) => scripts;

  const Style = withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient,
    mapStateOnServer,
  )(LocalScript);

  module.exports = Style;
}
