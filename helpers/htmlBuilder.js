const serialize = require('serialize-javascript');

const injectGoogleAnalytics = ({ gTag, nonce }) => {
  if (!gTag) {
    return '';
  }
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${gTag}" nonce="${nonce}"></script>
  <script nonce="${nonce}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${gTag}');
  </script>`;
};

const buildCommonHtml = ({
  helmetTags,
  loadableStyleTags,
  preloadedStateTag,
  styleTags,
  loadableScriptTags,
  title,
  titleMetaTag,
  analyticID,
  langAttr,
  app,
  i18nClient,
  nonce,
}) => `
<!doctype html>
<html ${langAttr} ${helmetTags.htmlAttributes}>
<head>
    ${titleMetaTag}
    <title>${title}</title>
    ${styleTags}
    ${loadableStyleTags}
    ${helmetTags.meta}
    ${helmetTags.link}
    ${helmetTags.style}

</head>
<body ${helmetTags.bodyAttributes}>
    <div id="app">${app}</div>
    ${preloadedStateTag}
    ${injectGoogleAnalytics({ gTag: analyticID, nonce })}
    <script nonce="${nonce}">(function(){window.__I18N__ = ${
  i18nClient ? serialize(i18nClient) : null
}}).apply(window)</script>
    ${helmetTags.script}
    ${loadableScriptTags}
</body>
</html>`;

module.exports = { buildCommonHtml };
