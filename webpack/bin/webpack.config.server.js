/**
 * @module webpack.config.server
 * @listens MIT
 * @author nuintun
 * @description Webpack development configure.
 * @see https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/webpackDevServer.config.js
 */

'use strict';

const mode = 'development';

process.env.NODE_ENV = mode;
process.env.BABEL_ENV = mode;

const koa = require('koa');
const webpack = require('webpack');
const pkg = require('../../package.json');
const loaders = require('../lib/loaders');
const koaWebpack = require('koa-webpack');
const koaCompress = require('koa-compress');
const findPorts = require('find-free-ports');
const getLocalExternalIP = require('../lib/ip');
const configure = require('./webpack.config.base');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const { publicPath, sourceMapExclude, watchOptions, entryHTML } = require('../configure');

async function randomPort(startPort = 8000, endPort = 9000) {
  const [port] = await findPorts(1, { startPort, endPort });

  return port;
}

async function server() {
  const ip = getLocalExternalIP();
  const port = await randomPort();
  const devServerHost = `http://${ip}:${port}`;
  const devServerPublicPath = devServerHost + publicPath;

  configure.mode = mode;
  configure.stats = 'none';
  configure.devtool = 'none';
  configure.output = Object.assign(configure.output, {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: devServerPublicPath
  });
  configure.plugins = [
    ...configure.plugins,
    new webpack.EnvironmentPlugin({ NODE_ENV: mode }),
    new webpack.SourceMapDevToolPlugin({ exclude: sourceMapExclude }),
    new ExtractCssChunks({ filename: 'css/[name].css', chunkFilename: 'css/[id].css', ignoreOrder: true })
  ];
  configure.module.rules = loaders(true);

  const compiler = webpack(configure);

  compiler.name = pkg.name;

  const devMiddleware = await koaWebpack({
    compiler,
    hotClient: {
      host: ip,
      logLevel: 'silent'
    },
    devMiddleware: {
      watchOptions,
      logLevel: 'silent',
      writeToDisk: file => file === entryHTML,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true }
    }
  });

  const app = new koa();

  app.use(koaCompress());
  app.use(devMiddleware);

  app.listen(port);
}

server();
