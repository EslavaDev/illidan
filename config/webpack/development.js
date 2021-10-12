/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, node/no-unsupported-features/es-syntax, import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    https: true,
    inline: true,
    port: process.env.PORT || 9090,
    disableHostCheck: true,
  },
  output: {
    filename: `[name].js`,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: true,
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      publicPath: '/static/',
    }),
  ],
  optimization: {
    usedExports: true,
  },
});
