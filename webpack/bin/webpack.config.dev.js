/**
 * @module webpack.config.dev
 * @listens MIT
 * @author nuintun
 * @description Webpack development configure.
 * @see https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/webpack.config.dev.js
 */

'use strict';

const mode = 'development';

process.env.NODE_ENV = mode;
process.env.BABEL_ENV = mode;

const webpack = require('webpack');
const loaders = require('../lib/loaders');
const configure = require('./webpack.config.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const { entryHTML, sourceMapExclude, watchOptions } = require('../configure');

configure.mode = mode;
configure.devtool = 'none';
configure.output = Object.assign(configure.output, {
  filename: 'js/[name].js',
  chunkFilename: 'js/[name].js'
});
configure.plugins = [
  ...configure.plugins,
  new webpack.EnvironmentPlugin({ NODE_ENV: mode }),
  new webpack.SourceMapDevToolPlugin({ exclude: sourceMapExclude }),
  new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', entryHTML] }),
  new ExtractCssChunks({ filename: 'css/[name].css', chunkFilename: 'css/[id].css', ignoreOrder: true })
];
configure.module.rules = loaders();
configure.watchOptions = watchOptions;

module.exports = configure;
