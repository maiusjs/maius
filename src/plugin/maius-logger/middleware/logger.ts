import { Middleware } from 'koa';
import Logger from '../../../core/lib/logger';

module.exports = function maiusLogger(options, app, pluginOptions): Middleware {
  return getKoaLogger(Logger.getInstance().getlogger('http'), { level: 'auto' });
};

/**
 * Logger options
 */
interface ILoggerOptions {
  format?: string;
  level?: string;
  nolog?: boolean;
  tokens?: any[];
}

const levels: any = Logger.levels;

/**
 *  inspired from npm package `log4js` and `koa-log4js`
 */

const DEFAULT_FORMAT = ':remote-addr - -' +
  ' ":method :url HTTP/:http-version"' +
  ' :status :content-length ":referrer"' +
  ' ":user-agent"';

/**
 * Log requests with the given `options` or a `format` string.
 *
 * Options:
 *
 *   - `format`        Format string, see below for tokens
 *   - `level`         A log4js levels instance. Supports also 'auto'
 *
 * Tokens:
 *
 *   - `:req[header]` ex: `:req[Accept]`
 *   - `:res[header]` ex: `:res[Content-Length]`
 *   - `:http-version`
 *   - `:response-time`
 *   - `:remote-addr`
 *   - `:date`
 *   - `:method`
 *   - `:url`
 *   - `:referrer`
 *   - `:user-agent`
 *   - `:status`
 *
 * @param {String|Function|Object} format or options
 * @return {Function}
 * @api public
 */

function getKoaLogger(logger4js, options: ILoggerOptions) {

  const thislogger = logger4js;
  let level = levels.getLevel(options.level, levels.INFO);
  const fmt = options.format || DEFAULT_FORMAT;
  const nolog = options.nolog ? createNoLogCondition(options.nolog) : null;

  return async (ctx, next) => {
    // mount safety
    if (ctx.request._logging) {
      await next();
      return;
    }

    // nologs
    if (nolog && nolog.test(ctx.originalUrl)) {
      await next();
      return;
    }

    if (thislogger.isLevelEnabled(level) || options.level === 'auto') {
      const start = Date.now();
      const writeHead = ctx.response.writeHead;

      // flag as logging
      ctx.request._logging = true;

      // proxy for statusCode.
      ctx.response.writeHead = (code, headers) => {
        ctx.response.writeHead = writeHead;
        ctx.response.writeHead(code, headers);
        ctx.response.__statusCode = code;
        ctx.response.__headers = headers || {};

        // status code response level hling
        if (options.level === 'auto') {
          level = levels.INFO;
          if (code >= 300) level = levels.WARN;
          if (code >= 400) level = levels.ERROR;
        } else {
          level = levels.getLevel(options.level, levels.INFO);
        }
      };

      await next();
      // hook on end request to emit the log entry of the HTTP request.
      ctx.response.responseTime = Date.now() - start;
      // status code response level handling
      if (ctx.res.statusCode && options.level === 'auto') {
        level = levels.INFO;
        if (ctx.res.statusCode >= 300) level = levels.WARN;
        if (ctx.res.statusCode >= 400) level = levels.ERROR;
      }
      if (thislogger.isLevelEnabled(level)) {
        const combinedTokens = assembleTokens(ctx, options.tokens || []);
        thislogger.log(level, format(fmt, combinedTokens));
      }
    } else {
      // ensure next gets always called
      await next();
    }
  };
}

/**
 * Adds custom {token, replacement} objects to defaults,
 * overwriting the defaults if any tokens clash
 *
 * @param  {Koa Context} ctx
 * @param  {Array} customTokens [
 *                      {
 *                        token: string-or-regexp,
 *                        replacement: string-or-replace-function,
 *                        content: a replace function with `ctx`
 *                      }
 *                 ]
 * @return {Array}
 */

/* tslint:disable:object-literal-sort-keys */
function assembleTokens(ctx, customTokens) {
  const arrayUniqueTokens = array => {
    const ary = array.concat();
    for (let i = 0; i < ary.length; i = i + 1) {
      for (let j = i + 1; j < ary.length; j = j + 1) {
        if (ary[i].token === ary[j].token) { // not === because token can be regexp object
          ary.splice(j, 1);
          j = j - 1;
        }
      }
    }
    return ary;
  };

  const defaultTokens = [];
  defaultTokens.push({ token: ':url', replacement: ctx.originalUrl });
  defaultTokens.push({ token: ':protocol', replacement: ctx.protocol });
  defaultTokens.push({ token: ':hostname', replacement: ctx.hostname });
  defaultTokens.push({ token: ':method', replacement: ctx.method });
  defaultTokens.push({
    token: ':status',
    replacement: ctx.response.status || ctx.response.__statusCode ||
      ctx.res.statusCode });
  defaultTokens.push({ token: ':response-time', replacement: ctx.response.responseTime });
  defaultTokens.push({ token: ':date', replacement: new Date().toUTCString() });
  defaultTokens.push({ token: ':referrer', replacement: ctx.headers.referer || '' });
  defaultTokens.push({ token: ':http-version',
    replacement: ctx.req.httpVersionMajor + '.' + ctx.req.httpVersionMinor });
  defaultTokens.push({
    token: ':remote-addr',
    replacement: ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress ||
    (ctx.socket.socket && ctx.socket.socket.remoteAddress)))});
  defaultTokens.push({ token: ':user-agent', replacement: ctx.headers['user-agent'] });
  defaultTokens.push({
    token: ':content-length',
    replacement: (ctx.response._headers && ctx.response._headers['content-length']) ||
      (ctx.response.__headers && ctx.response.__headers['Content-Length']) ||
      ctx.response.length || '-'});
  defaultTokens.push({
    token: /:req\[([^\]]+)\]/g,
    replacement: (_, field) => {
      return ctx.headers[field.toLowerCase()];
    },
  });
  defaultTokens.push({
    token: /:res\[([^\]]+)\]/g,
    replacement: (_, field) => {
      return ctx.response._headers
        ? (ctx.response._headers[field.toLowerCase()] || ctx.response.__headers[field])
        : (ctx.response.__headers && ctx.response.__headers[field]);
    },
  });

  const tokens = customTokens.map(token => {
    if (token.content && typeof token.content === 'function') {
      token.replacement = token.content(ctx);
    }
    return token;
  });

  return arrayUniqueTokens(tokens.concat(defaultTokens));
}
/* tslint:enable:object-literal-sort-keys */

/**
 * Return formatted log line.
 *
 * @param  {String} str
 *
 */

function format(str: string, tokens): string {
  let ret = str;
  for (const item of tokens) {
    ret = ret.replace(item.token, item.replacement);
  }
  return ret;
}

/**
 * Return RegExp Object about nolog
 *
 * @param  {String} nolog
 * @return {RegExp}
 * @api private
 *
 */
function createNoLogCondition(nolog) {

  if (!nolog) {
    return null;
  }

  let regexp = null;

  if (nolog instanceof RegExp) {
    regexp = nolog;
  }

  if (typeof nolog === 'string') {
    regexp = new RegExp(nolog);
  }

  if (Array.isArray(nolog)) {
    const regexpsAsStrings = nolog.map(o => (o.source ? o.source : o));
    regexp = new RegExp(regexpsAsStrings.join('|'));
  }

  return regexp;
}
