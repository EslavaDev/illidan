const fs = require('fs');
const { join } = require('path');

class Manifest {
  static async getManifest(config) {
    const { basePath, manifest, useCache } = config;
    if (useCache && Manifest.cache.has(manifest)) {
      return Manifest.cache.get(manifest);
    }
    try {
      const content = await fs.promises.readFile(join(basePath, manifest));
      let manifestData;
      try {
        manifestData = JSON.parse(content.toString());
        Manifest.cache.set(manifest, manifestData);
        return manifestData;
      } catch (e) {
        console.error('Error parsing manifest', e);
        return {};
      }
    } catch (e) {
      console.error('Error reading manifest', e);
      return {};
    }
  }
}

Manifest.cache = new Map();

module.exports = { Manifest };
