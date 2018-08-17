"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const fs = require("fs");
const path = require("path");
const type_1 = require("../utils/type");
const debug = Debug('maius:MiddlewareLoader');
class MiddlewareLoader {
    constructor(app, dirname, config) {
        this.app = app;
        this.config = Array.isArray(config) ? config : [];
        this.middlewareConfigList = [];
        this.middlewareFnCol = this.collectMiddleware(dirname);
        this.handleMiddlewareConfig();
        debug('fitered config: %o', this.middlewareConfigList);
    }
    load(...extendArgs) {
        for (let i = 0; i < this.middlewareConfigList.length; i += 1) {
            const itemConfig = this.middlewareConfigList[i];
            const name = itemConfig.name;
            let mdw = null;
            if (type_1.isFunction(name)) {
                mdw = name;
                debug('use middleware - %s', mdw.name);
            }
            else if ('string' === typeof name) {
                if (!this.middlewareFnCol[name]) {
                    console.warn('Not fount the middlware %s', name);
                    continue;
                }
                mdw = this.middlewareFnCol[name];
                debug('use middleware - %s', name);
            }
            else {
                continue;
            }
            const args = itemConfig.args;
            const options = itemConfig.options;
            const fn = args
                ? mdw(...args)
                : mdw(options, this.app, ...extendArgs);
            this.app.use(fn);
        }
    }
    collectMiddleware(dirname) {
        const middlewareCol = {};
        let fileList = null;
        try {
            fileList = fs.readdirSync(dirname);
        }
        catch (error) {
            return middlewareCol;
        }
        for (let i = 0; i < fileList.length; i += 1) {
            const filename = fileList[i];
            const filepath = path.join(dirname, filename);
            if (!/\.js$/.test(filepath))
                continue;
            const fn = this.requireMiddleware(filepath);
            const basename = path.basename(filename, path.extname(filename));
            if (fn) {
                middlewareCol[basename] = fn;
            }
        }
        return middlewareCol;
    }
    requireMiddleware(filepath) {
        try {
            const fn = require(filepath);
            if (type_1.isFunction(fn)) {
                return fn;
            }
            return null;
        }
        catch (error) {
            console.log();
            console.error(error);
            console.log();
            return null;
        }
    }
    handleMiddlewareConfig() {
        for (let i = 0; i < this.config.length; i += 1) {
            const item = this.config[i];
            if (!this.checkSafe(item, i)) {
                continue;
            }
            if (item.disabled) {
                continue;
            }
            this.proxyPushItem(item);
        }
    }
    proxyPushItem(item) {
        for (let i = 0; i < this.middlewareConfigList.length; i += 1) {
            const middlewareConfig = this.middlewareConfigList[i];
            if (middlewareConfig.name === item.name) {
                this.middlewareConfigList.splice(i, 1, item);
                return;
            }
        }
        this.middlewareConfigList.push(item);
    }
    checkSafe(config, index) {
        const { name, args, disabled } = config;
        if ('string' !== typeof name && 'function' !== typeof name) {
            console.warn(`Expect config.middleware[${index}].name is a string or function,\
but accept ${typeof name}.`);
            return false;
        }
        if (args && !Array.isArray(args)) {
            console.warn(`Expect config.middleware[${index}].args is an array,\
but accept ${typeof name}.`);
            return false;
        }
        if (disabled !== undefined && 'boolean' !== typeof disabled) {
            console.warn(`Expect config.middleware[${index}].disabled is a boolean,\
but accept ${typeof name}.`);
            return false;
        }
        return true;
    }
}
exports.default = MiddlewareLoader;
