const serialize = require('serialize-javascript');

const injectGoogleAnalytics = ({ gTag }) => {
  if (!gTag) {
    return '';
  }
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${gTag}"></script>
  <script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${gTag}');
  </script>`;
};

const buildCommonHtml = ({
  helmetTags,
  loadableStyleTags,
  styleTags,
  loadableScriptTags,
  title,
  titleMetaTag,
  analyticID,
  langAttr,
  app,
  i18nClient,
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
    ${injectGoogleAnalytics({ gTag: analyticID })}
    <script>(function(){window.__I18N__ = ${
      i18nClient ? serialize(i18nClient) : null
    }}).apply(window)</script>
    ${helmetTags.script}
    ${loadableScriptTags}
</body>
</html>`;

module.exports = { buildCommonHtml };
