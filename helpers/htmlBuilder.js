const serialize = require('serialize-javascript');

const injectGoogleAnalytics = ({ gTag, nonce }) => {
  if (!gTag) {
    return '';
  }
  return `
  <script async src="https://www.googletagmanager.com/gtag/js?id=${gTag}" nonce="${nonce}"></script>
  <script nonce="${nonce}">
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gTag}');
  </script>`;
};

const injectGoogleTagManagerHead = ({ gtm, nonce }) => {
  if (!gtm) {
    return '';
  }
  return `
  <script nonce="${nonce}">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${gtm}');</script>
  `
};

const injectGoogleTagManagerBody = ({ gtm }) => {
  if (!gtm) {
    return '';
  }
  return `
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtm}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  `
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
  tagManagerID,
  langAttr,
  app,
  i18nClient,
  nonce,
}) => `
<!doctype html>
<html ${langAttr} ${helmetTags.htmlAttributes}>
<head>
    ${injectGoogleTagManagerHead({gtm: tagManagerID, nonce})}
    ${titleMetaTag}
    <title>${title}</title>
    ${styleTags}
    ${loadableStyleTags}
    ${helmetTags.meta}
    ${helmetTags.link}
    ${helmetTags.style}
</head>
<body ${helmetTags.bodyAttributes}>
    ${injectGoogleTagManagerBody({gtm: tagManagerID})}
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
