module.exports = {
  extends: require.resolve('./babel.conf.common'),
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'defaults, not IE 11',
        modules: false,
      },
    ],
  ],
};
