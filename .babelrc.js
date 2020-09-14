/**
 * @module .babelrc
 * @listens MIT
 * @author nuintun
 * @description Babel configure.
 */

'use strict';

const browsers = require('./package.json').browserslist;

module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false, bugfixes: true, corejs: 3, useBuiltIns: 'usage', targets: { browsers } }],
    ['@babel/preset-react', { useBuiltIns: true, development: process.env.BABEL_ENV === 'development' }],
    ['@babel/preset-typescript', { allowDeclareFields: true }]
  ],
  plugins: [
    ['import', { style: true, libraryName: 'antd', libraryDirectory: 'es' }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-decorators', { legacy: true }]
  ]
};
