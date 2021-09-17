module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: process.env.IS_BROWSER
          ? 'defaults, not IE 11'
          : {
              node: 14,
            },
        modules: process.env.IS_BROWSER ? false : 'commonjs',
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
