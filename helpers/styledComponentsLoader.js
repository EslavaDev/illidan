const React = require('react');

class ServerStyleSheetStub {
  collectStyles(Element) {
    return Element;
  }

  getStyleTags() {
    return '';
  }

  getStyleElement() {
    return React.createElement(React.Fragment);
  }

  seal() {}
}

function getServerStyleSheet() {
  if (!getServerStyleSheet.ServerStyleSheet) {
    try {
      getServerStyleSheet.ServerStyleSheet =
        require('styled-components').ServerStyleSheet;
    } catch {
      getServerStyleSheet.ServerStyleSheet = ServerStyleSheetStub;
    }
  }
  return getServerStyleSheet.ServerStyleSheet;
}

module.exports = { getServerStyleSheet };
