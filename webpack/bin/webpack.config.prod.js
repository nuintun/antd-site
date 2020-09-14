/**
 * @module webpack.config.prod
 * @listens MIT
 * @author nuintun
 * @description Webpack production configure.
 * @see https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/webpack.config.prod.js
 */

'use strict';

const mode = 'production';

process.env.NODE_ENV = mode;
process.env.BABEL_ENV = mode;

const webpack = require('webpack');
const loaders = require('../lib/loaders');
const configure = require('./webpack.config.base');
const TerserPlugin = require('terser-webpack-plugin');
const { entryHTML, recordsPath } = require('../configure');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

configure.mode = mode;
configure.bail = true;
configure.devtool = 'none';
configure.recordsPath = recordsPath;
configure.output = Object.assign(configure.output, {
  filename: 'js/[chunkhash].js',
  chunkFilename: 'js/[chunkhash].js'
});
configure.plugins = [
  ...configure.plugins,
  new webpack.optimize.AggressiveMergingPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.EnvironmentPlugin({ NODE_ENV: mode }),
  new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', entryHTML] }),
  new ExtractCssChunks({ filename: 'css/[chunkhash].css', chunkFilename: 'css/[chunkhash].css', ignoreOrder: true })
];
configure.module.rules = loaders();
configure.optimization.minimizer = [
  new TerserPlugin({ cache: true, parallel: true, sourceMap: false }),
  new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { reduceIdents: false } })
];

module.exports = configure;
