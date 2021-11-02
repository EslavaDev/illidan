module.exports = {
  extends: require.resolve('./babel.conf.common'),
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
  ],
  plugins: [
    [
      'babel-plugin-transform-require-ignore',
      {
        extensions: ['.less', '.sass', '.css', '.scss'],
      },
    ],
  ],
  sourceMaps: true,
};
