const { getJsConfigPath } = require('../util/jsconfigPath');

const getModuleResolver = () => {
  const jsConfigPath = getJsConfigPath();

  if (!jsConfigPath) {
    return null;
  }

  // eslint-disable-next-line import/no-dynamic-require
  const jsconfig = require(jsConfigPath);

  if (
    !jsconfig.compilerOptions ||
    !jsconfig.compilerOptions.baseUrl ||
    !jsconfig.compilerOptions.paths
  ) {
    return null;
  }

  // eslint-disable-next-line prefer-const
  let { baseUrl, paths } = jsconfig.compilerOptions;

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
      realPath = './'.concat(realPath.slice(0, -2));
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

const plugins = ['@loadable/babel-plugin'];

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

module.exports = {
  plugins,
  presets,
};
