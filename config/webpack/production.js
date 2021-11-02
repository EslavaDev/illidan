/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, node/no-unsupported-features/es-syntax, import/no-extraneous-dependencies */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    filename: `[name].[chunkhash:8].js`,
  },
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  /* optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      }
    }
  }, */
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      ignoreOrder: true,
    }),
    // new BundleAnalyzerPlugin(),
  ],
});
