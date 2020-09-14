/**
 * @module loaders
 * @listens MIT
 * @author nuintun
 * @description Get webpack loaders.
 */

'use strict';

const fs = require('fs');
const less2js = require('./less2js');
const { context, themePath } = require('../configure');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

/**
 * @function readTheme
 * @description 获取主题
 * @param {string} themePath
 * @returns {object}
 */
function readTheme(themePath) {
  try {
    return less2js(fs.readFileSync(themePath, 'utf8'));
  } catch {
    return {};
  }
}

const theme = readTheme(themePath);
const sourceMap = process.env.NODE_ENV !== 'production';
const localIdentName = sourceMap ? '[local]-[hash:base64:6]' : '[hash:base64:6]';

module.exports = (hmr = false) => {
  return [
    {
      parser: {
        requireEnsure: false
      }
    },
    {
      oneOf: [
        // The loader for js
        {
          test: /\.tsx?$/i,
          exclude: /[\\/]node_modules[\\/]/,
          use: [
            {
              loader: 'babel-loader',
              options: { highlightCode: true, cacheDirectory: true }
            }
          ]
        },
        // The loader for css
        {
          test: /\.css$/i,
          use: [
            {
              loader: ExtractCssChunks.loader,
              options: { hmr, esModule: true, reloadAll: hmr }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap,
                esModule: true,
                importLoaders: 1,
                modules: { auto: true, localIdentName, exportLocalsConvention: 'camelCaseOnly' }
              }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap }
            }
          ]
        },
        // The loader for less
        {
          test: /\.less$/i,
          use: [
            {
              loader: ExtractCssChunks.loader,
              options: { hmr, esModule: true, reloadAll: hmr }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap,
                esModule: true,
                importLoaders: 2,
                modules: { auto: true, localIdentName, exportLocalsConvention: 'camelCaseOnly' }
              }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap }
            },
            {
              loader: 'less-loader',
              options: { sourceMap, lessOptions: { modifyVars: theme, javascriptEnabled: true } }
            }
          ]
        },
        // The loader for assets
        {
          test: /\.(mp3|ogg|wav|mp4|flv|webm)$/i,
          use: [
            {
              loader: 'file-loader',
              options: { context, esModule: false, name: '[path][name]-[hash:8].[ext]' }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico|woff2?|ttf|eot)$/i,
          use: [
            {
              loader: 'url-loader',
              options: { limit: 8192, context, esModule: false, name: '[path][name]-[hash:8].[ext]' }
            }
          ]
        }
      ]
    }
  ];
};
