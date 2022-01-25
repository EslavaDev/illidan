/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, node/no-unsupported-features/es-syntax, import/no-extraneous-dependencies */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    filename: `js/[name].[chunkhash:8].js`,
    chunkFilename: 'js/chunks/[id].[chunkhash:8].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-i18next|classnames|i18next|styled-components|i18next-browser-languagedetector|axios|@loadable\/component)[\\/]/,
          chunks: 'all',
          name: 'vendor',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[id].[chunkhash:8].css',
      ignoreOrder: true,
    }),
    // new BundleAnalyzerPlugin(),
  ],
});
