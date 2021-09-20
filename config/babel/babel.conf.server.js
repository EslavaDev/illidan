module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: 'auto',
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    ['@babel/preset-typescript'],
    '@babel/preset-flow',
  ],
  plugins: [
    [
      'babel-plugin-transform-require-ignore',
      {
        extensions: ['.less', '.sass', '.css', '.scss'],
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          api: `./src/api`,
          app: `./src/app`,
          common: `./src/common`,
        },
      },
    ],
    '@loadable/babel-plugin',
  ],
  sourceMaps: true,
};
