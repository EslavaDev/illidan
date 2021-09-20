/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, node/no-unsupported-features/es-syntax, import/no-extraneous-dependencies */
const Dotenv = require('dotenv-webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const LoadablePlugin = require('@loadable/webpack-plugin');

const root = process.cwd();

module.exports = (env, { mode }) =>
  // eslint-disable-next-line import/no-dynamic-require
  merge(require(`./${mode}`), {
    output: {
      path: path.resolve(root, 'public'),
    },
    // eslint-disable-next-line import/no-dynamic-require
    entry: require(path.resolve(root, 'cronos.config.js')).clientEntry,
    plugins: [
      new webpack.DefinePlugin({
        'process.env.IS_BROWSER': process.env.IS_BROWSER,
      }),
      new Dotenv({
        path: `${root}/.env.${mode}`,
        allowEmptyValues: true,
      }),
      new LoadablePlugin(),
    ],
  });
