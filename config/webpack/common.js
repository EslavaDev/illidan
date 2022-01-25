/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, node/no-unsupported-features/es-syntax, import/no-extraneous-dependencies */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
// eslint-disable-next-line import/no-dynamic-require
const cronosConfig = require(path.resolve(process.cwd(), 'cronos.config'));

const {
  spa: {
    federatedModule = null,
    htmlTemplate = null,
    publicPath = 'auto',
  } = {},
} = cronosConfig;

module.exports = {
  output: {
    publicPath,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
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
    !process.env.CRONOS_SERVE_SPA &&
      new CleanWebpackPlugin({
        verbose: true,
      }),
    htmlTemplate &&
      new HtmlWebpackPlugin({
        favicon: path.resolve(__dirname, '../../assets/favicon.ico'),
        template: path.resolve(process.cwd(), htmlTemplate),
      }),
    federatedModule && new ModuleFederationPlugin(federatedModule),
  ].filter(Boolean),
};
