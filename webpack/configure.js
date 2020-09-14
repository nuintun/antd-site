/**
 * @module configure
 * @listens MIT
 * @author nuintun
 * @description Paths configure.
 */

'use strict';

const path = require('path');

const moment = 'dayjs';
const js = path.resolve('Assets/js');
const css = path.resolve('Assets/css');
const images = path.resolve('Assets/images');
const useDayjsForAntd = path.resolve('Assets/js/utils/dayjs.ts');

module.exports = {
  title: 'Antd Site',
  publicPath: '/public/',
  context: path.resolve('Assets'),
  outputPath: path.resolve('wwwroot/public'),
  entryHTML: path.resolve('wwwroot/app.html'),
  themePath: path.resolve('Assets/css/theme.less'),
  entry: [useDayjsForAntd, path.resolve('Assets/js/pages/App.tsx')],
  alias: {
    js,
    css,
    images,
    moment,
    '~js': js,
    '~css': css,
    '~images': images
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    repl: 'empty',
    dgram: 'empty',
    module: 'empty',
    cluster: 'empty',
    readline: 'empty',
    child_process: 'empty'
  },
  stats: {
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    entrypoints: false,
    modules: false,
    moduleTrace: false,
    publicPath: false,
    reasons: false,
    source: false,
    timings: false
  },
  performance: {
    hints: false
  },
  recordsPath: path.resolve('node_modules/.cache/webpack/records.json'),
  sourceMapExclude: /[\\/](runtime|react|antd|antv|vendor-[^\\/]+)\.(js|css)$/i
};
