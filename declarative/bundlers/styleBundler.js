/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, import/no-extraneous-dependencies */

// const { Manifest } = require('../../helpers/manifest');
// const Style = require('../Style');

const defaults = {
  basePath: 'public',
  useCache: process.env.NODE_ENV === 'producion',
  manifest: 'manifest.json',
};

class StyleBundler {
  constructor(config) {
    if (!config) {
      // eslint-disable-next-line no-param-reassign
      config = {};
    }
    this.config = { ...defaults, ...config };
  }

  /* async joinStyles(basePath) {
    const styles = Style.rewind();
    const manifest = await Manifest.getManifest(this.config);
    const sources = styles.map((style) => {
      if (style.type === 'source') {
        // eslint-disable-next-line no-param-reassign
        style.src = manifest[style.src];
      }
      return StyleBundler.getStyleContent(style.src, basePath);
    });
    return sources.join('\n');
  } */

  static getStyleContent(path, basePath) {
    return `<link rel="stylesheet" href="${basePath}/static/${path}">`;
  }
}

module.exports = { StyleBundler };
