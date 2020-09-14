'use strict';

const fs = require('fs');
const Koa = require('koa');
const serve = require('koa-files');
const compress = require('koa-compress');

const app = new Koa();

app.proxy = true;

// Compress
app.use(compress());

// Static
app.use(serve('client/assets'));

// Fallback
app.use(async ctx => {
  ctx.type = 'text/html';

  return (ctx.body = fs.createReadStream('wwwroot/app.html'));
});

/**
 * @function httpError
 * @param {NodeJS.ErrnoException} error
 * @returns {boolean}
 */
function httpError(error) {
  return /^(EOF|EPIPE|ECANCELED|ECONNRESET|ECONNABORTED)$/i.test(error.code);
}

// Error
app.on('error', error => !httpError(error) && console.error(error));

const port = process.env.PORT || 8888;

app.listen(port, () => {
  const timestamp = new Date().toLocaleString();

  console.log(`[${timestamp}] Server start success at port ${port}!`);
});
