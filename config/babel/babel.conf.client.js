const plugins = [];

if (
  process.env.ILLIDAN_SERVE_SPA &&
  (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
) {
  plugins.push('react-refresh/babel');
}

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
  plugins,
};
