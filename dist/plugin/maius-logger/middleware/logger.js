"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../../core/lib/logger");
module.exports = function maiusLogger(options, app, pluginOptions) {
    return getKoaLogger(logger_1.default.getInstance().getlogger('http'), { level: 'auto' });
};
const levels = logger_1.default.levels;
const DEFAULT_FORMAT = ':remote-addr - -' +
    ' ":method :url HTTP/:http-version"' +
    ' :status :content-length ":referrer"' +
    ' ":user-agent"';
function getKoaLogger(logger4js, options) {
    const thislogger = logger4js;
    let level = levels.getLevel(options.level, levels.INFO);
    const fmt = options.format || DEFAULT_FORMAT;
    const nolog = options.nolog ? createNoLogCondition(options.nolog) : null;
    return async (ctx, next) => {
        if (ctx.request._logging) {
            await next();
            return;
        }
        if (nolog && nolog.test(ctx.originalUrl)) {
            await next();
            return;
        }
        if (thislogger.isLevelEnabled(level) || options.level === 'auto') {
            const start = Date.now();
            const writeHead = ctx.response.writeHead;
            ctx.request._logging = true;
            ctx.response.writeHead = (code, headers) => {
                ctx.response.writeHead = writeHead;
                ctx.response.writeHead(code, headers);
                ctx.response.__statusCode = code;
                ctx.response.__headers = headers || {};
                if (options.level === 'auto') {
                    level = levels.INFO;
                    if (code >= 300)
                        level = levels.WARN;
                    if (code >= 400)
                        level = levels.ERROR;
                }
                else {
                    level = levels.getLevel(options.level, levels.INFO);
                }
            };
            await next();
            ctx.response.responseTime = Date.now() - start;
            if (ctx.res.statusCode && options.level === 'auto') {
                level = levels.INFO;
                if (ctx.res.statusCode >= 300)
                    level = levels.WARN;
                if (ctx.res.statusCode >= 400)
                    level = levels.ERROR;
            }
            if (thislogger.isLevelEnabled(level)) {
                const combinedTokens = assembleTokens(ctx, options.tokens || []);
                thislogger.log(level, format(fmt, combinedTokens));
            }
        }
        else {
            await next();
        }
    };
}
function assembleTokens(ctx, customTokens) {
    const arrayUniqueTokens = array => {
        const ary = array.concat();
        for (let i = 0; i < ary.length; i = i + 1) {
            for (let j = i + 1; j < ary.length; j = j + 1) {
                if (ary[i].token === ary[j].token) {
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
            ctx.res.statusCode
    });
    defaultTokens.push({ token: ':response-time', replacement: ctx.response.responseTime });
    defaultTokens.push({ token: ':date', replacement: new Date().toUTCString() });
    defaultTokens.push({ token: ':referrer', replacement: ctx.headers.referer || '' });
    defaultTokens.push({ token: ':http-version',
        replacement: ctx.req.httpVersionMajor + '.' + ctx.req.httpVersionMinor });
    defaultTokens.push({
        token: ':remote-addr',
        replacement: ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
            (ctx.socket && (ctx.socket.remoteAddress ||
                (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
    });
    defaultTokens.push({ token: ':user-agent', replacement: ctx.headers['user-agent'] });
    defaultTokens.push({
        token: ':content-length',
        replacement: (ctx.response._headers && ctx.response._headers['content-length']) ||
            (ctx.response.__headers && ctx.response.__headers['Content-Length']) ||
            ctx.response.length || '-'
    });
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
function format(str, tokens) {
    let ret = str;
    for (const item of tokens) {
        ret = ret.replace(item.token, item.replacement);
    }
    return ret;
}
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
