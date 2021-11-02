const { existsSync } = require('fs');
const path = require('path');

const getJsConfigPath = () => {
  // TS_NODE_PROJECT

  const rootPath = process.cwd();

  if (existsSync(path.resolve(rootPath, 'tsconfig.json'))) {
    return path.resolve(rootPath, 'tsconfig.json');
  }
  if (existsSync(path.resolve(rootPath, 'jsconfig.json'))) {
    return path.resolve(rootPath, 'jsconfig.json');
  }

  return null;
};

module.exports = {
  getJsConfigPath,
};
