/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, node/no-unsupported-features/es-syntax, import/no-extraneous-dependencies */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-dynamic-require
const cronosConfig = require(path.resolve(process.cwd(), 'cronos.config'));

const { spa: { htmlTemplate = null } = {} } = cronosConfig;

module.exports = {
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          name: 'media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: require('../babel/babel.conf.client'),
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    ...(htmlTemplate
      ? [
          new HtmlWebpackPlugin({
            template: path.resolve(process.cwd(), htmlTemplate),
          }),
        ]
      : []),
  ],
};
