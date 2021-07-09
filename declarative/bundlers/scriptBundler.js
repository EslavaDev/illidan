/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

const Script = require('../Script');

const defaults = {
  basePath: 'public',
  useCache: process.env.NODE_ENV === 'producion',
  manifest: 'manifest.json',
};

class ScriptBundler {
  constructor(config) {
    if (!config) {
      config = {};
    }
    this.config = { ...defaults, ...config };
  }

  async joinScripts() {
    const scripts = Script.rewind();
    const plain = scripts.map((script) => ScriptBundler.getScriptTag(script));
    return plain.join('\n');
  }

  static getScriptTag(script) {
    return `<script>${script.src}</script>`;
  }

  static scriptAsString(script) {
    return `{src:${
      script.type === 'function' ? script.src : `"${script.src}"`
    }, type: "${script.type}" }`;
  }

  static render(renderScripts, basePath) {
    return `(function globalLoad(window, document) {
  function loadScripts(scripts) {
    const { head } = document;
    scripts.forEach((script) => {
      const scriptTag = document.createElement('script');
      if (script.type === 'function') {
        scriptTag.textContent = '(' + script.src + ').apply(window)';
      } else {
        scriptTag.defer = true;
        scriptTag.async = false;
        scriptTag.crossOrigin = 'anonymous';
        scriptTag.src = '${basePath}/static/' + script.src;
      }
      head.appendChild(scriptTag);
    });
  }
  const scripts = [${renderScripts}];
  if (document.readyState === 'complete') {
    loadScripts(scripts);
  } else {
    window.addEventListener('load', () => loadScripts(scripts));
  }
})(window, document);`;
  }
}

module.exports = { ScriptBundler };
