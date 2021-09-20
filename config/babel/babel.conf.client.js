module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'defaults, not IE 11',
        modules: false,
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
};
