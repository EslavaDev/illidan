const { getJsConfigPath } = require('../util/jsconfigPath');

const getModuleResolver = () => {
  const jsConfigPath = getJsConfigPath();

  if (!jsConfigPath) {
    return null;
  }

  // eslint-disable-next-line import/no-dynamic-require
  const jsconfig = require(jsConfigPath);

  if (!jsconfig.compilerOptions || !jsconfig.compilerOptions.baseUrl) {
    return null;
  }

  // eslint-disable-next-line prefer-const
  let { baseUrl, paths = {} } = jsconfig.compilerOptions;

  if (!baseUrl.startsWith('./')) {
    baseUrl = './'.concat(baseUrl);
  }

  const mappedPaths = {};

  Object.keys(paths).forEach((pathAlias) => {
    let realPath = paths[pathAlias][0];
    if (pathAlias.endsWith('/*')) {
      // eslint-disable-next-line no-param-reassign
      pathAlias = pathAlias.slice(0, -2);
    }

    if (realPath.endsWith('/*')) {
      realPath = baseUrl.concat(
        !baseUrl.endsWith('/') ? '/' : '',
        realPath.slice(0, -2),
      );
    }

    mappedPaths[pathAlias] = realPath;
  });

  const extensions = ['.js', '.jsx', '.ts', '.tsx'];

  return [
    'module-resolver',
    {
      root: [baseUrl],
      extensions,
      alias: mappedPaths,
    },
  ];
};

const plugins = [
  ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
  '@babel/plugin-proposal-class-properties',
];

const presets = [
  [
    '@babel/preset-react',
    {
      runtime: 'automatic',
    },
  ],
  ['@babel/preset-typescript'],
  '@babel/preset-flow',
];

const moduleResolver = getModuleResolver();

if (moduleResolver) {
  plugins.push(moduleResolver);
}

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  plugins.push('transform-react-remove-prop-types');
}

plugins.push('@loadable/babel-plugin');

module.exports = {
  plugins,
  presets,
};
