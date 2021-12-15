/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, node/no-unsupported-features/es-syntax, import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    host: 'dev.conektame.io',
    https: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/,
        use: [
          process.env.CRONOS_SERVE_SPA
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  output: {
    filename: `js/[name].js`,
    chunkFilename: 'js/chunks/[name].js',
  },
  plugins: [
    process.env.CRONOS_SERVE_SPA && new ReactRefreshWebpackPlugin(),
    !process.env.CRONOS_SERVE_SPA &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        ignoreOrder: true,
      }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      publicPath: '/static/',
    }),
  ].filter(Boolean),
  optimization: {
    usedExports: true,
  },
});
