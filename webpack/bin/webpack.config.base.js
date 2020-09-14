/**
 * @module webpack.config.base
 * @listens MIT
 * @author nuintun
 * @description Webpack base configure.
 */

'use strict';

const path = require('path');
const pkg = require('../../package.json');
const configure = require('../configure');
const notifier = require('node-notifier');
const getChunksName = require('../lib/chunks');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackBOMPlugin = require('html-webpack-bom-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
  entry: configure.entry,
  output: {
    pathinfo: false,
    path: configure.outputPath,
    publicPath: configure.publicPath
  },
  resolve: {
    alias: configure.alias,
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  node: configure.node,
  stats: configure.stats,
  performance: configure.performance,
  optimization: {
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    removeAvailableModules: true,
    runtimeChunk: { name: 'runtime' },
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '&',
      cacheGroups: {
        default: {
          minSize: 30720,
          reuseExistingChunk: true,
          name: getChunksName('chunk'),
          test: module => {
            const test = /[\\/]node_modules[\\/]/i;

            if (module.nameForCondition && test.test(module.nameForCondition())) {
              return false;
            }

            for (const chunk of module.chunksIterable) {
              if (chunk.name && test.test(chunk.name)) return false;
            }

            return true;
          }
        },
        react: {
          name: 'react',
          enforce: true,
          test: /[\\/]node_modules[\\/]react(-dom)?[\\/]/i
        },
        antd: {
          name: 'antd',
          enforce: true,
          test: /[\\/]node_modules[\\/]antd[\\/]/i
        },
        antv: {
          name: 'antv',
          enforce: true,
          test: /[\\/]node_modules[\\/](@antv|bizcharts)[\\/]/i
        },
        vendors: {
          enforce: true,
          reuseExistingChunk: true,
          name: getChunksName('vendor'),
          test: /[\\/]node_modules[\\/](?!(antd|react(-dom)?|@antv|bizcharts)[\\/])/i
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      xhtml: true,
      minify: true,
      title: configure.title,
      filename: configure.entryHTML,
      template: require.resolve('./index.ejs'),
      favicon: path.resolve('wwwroot/favicon.ico')
    }),
    new HTMLWebpackBOMPlugin(),
    new ProgressBarWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin({
      onErrors: (severity, errors) => {
        if (severity === 'error') {
          const error = errors[0];

          notifier.notify({
            sound: 'Glass',
            title: pkg.name,
            message: error.name,
            subtitle: error.file || '',
            icon: path.resolve('../icons/fail.png'),
            contentImage: path.resolve('../icons/fail.png')
          });
        }
      }
    })
  ],
  module: {
    strictExportPresence: true,
    noParse: configure.noParse
  }
};
