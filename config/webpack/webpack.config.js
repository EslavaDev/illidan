/* eslint-disable node/no-unpublished-require, node/no-extraneous-require, node/no-unsupported-features/es-syntax, import/no-extraneous-dependencies */
require('../../env');
const Dotenv = require('dotenv-webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const LoadablePlugin = require('@loadable/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const root = process.cwd();

// eslint-disable-next-line import/no-dynamic-require
const { version } = require(path.resolve(root, 'package.json'));

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
        'process.env.VERSION': JSON.stringify(version),
      }),
      new Dotenv({
        path: `${root}/.env.${process.env.NODE_ENV || 'development'}`,
        systemvars: true,
        allowEmptyValues: true,
      }),
      new LoadablePlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: 'assets/**/*',
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
  });
