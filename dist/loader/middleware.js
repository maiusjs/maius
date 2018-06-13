"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Debug = require("debug");
const fs = require("fs");
const path = require("path");
const mdw_opts_model_1 = require("../models/mdw-opts-model");
const index_1 = require("../utils/index");
const user_config_1 = require("./user-config");
const debug = Debug('maius:middlewareLoader');
const MIDDLEWARE = Symbol('middleware');
class MiddlewareLoader {
    constructor(maius) {
        this.userOptions = user_config_1.default.getIntance().options;
        assert(this.userOptions.rootDir);
        this.userConfig = user_config_1.default.getIntance().config;
        this.maius = maius;
        this.selfBeforeMdw = [
            this.makeOneSelfMiddlewareOpts('maius:static'),
            this.makeOneSelfMiddlewareOpts('maius:views'),
        ];
        this.selfAfterMdw = [
            this.makeOneSelfMiddlewareOpts('maius:router'),
        ];
        this.willBeReorderdNames = new Set();
    }
    useAllMiddleware() {
        this.getAllMiddlewareOpts().forEach(opts => {
            debug('Load one middleware: %o', opts);
            let fn = null;
            if ('function' === typeof opts.load) {
                opts.load(this.maius.app);
            }
            else {
                const func = fs.existsSync(opts._filename) ?
                    require(opts._filename) :
                    require(opts.name);
                assert(typeof func === 'function', `middleware ${opts.name} must be an function, but it is ${func}`);
                fn = func.apply(func, opts.args);
                this.maius.app.use(fn);
            }
        });
    }
    getAllMiddlewareOpts() {
        const middleware = [];
        const userMdwOpts = this.getMiddlewareConfig();
        const combinedMdwOpts = [
            ...this.filterBeRordered(this.selfBeforeMdw),
            ...this.mergeSelfOptsWithUserReorderedOpts(userMdwOpts),
            ...this.filterBeRordered(this.selfAfterMdw),
        ].filter(opts => opts);
        debug('combinedMiddleware: %O', combinedMdwOpts);
        return combinedMdwOpts;
    }
    getMiddlewareConfig() {
        const middleware = this.userConfig.middleware || [];
        assert(Array.isArray(middleware), '[config] middleware property must be an array type.');
        const optsList = middleware.map((opts, index) => {
            let cfg = new mdw_opts_model_1.default();
            if ('string' === typeof opts) {
                cfg.name = opts;
            }
            else {
                assert(typeof opts.name === 'string', `[config] middleware[${index}].name need string type value`);
                cfg.name = opts.name;
                cfg.args = opts.args;
            }
            cfg._filename = path.join(this.getMiddlewareDir(), `${cfg.name}.js`);
            if (this.willBeReorderdNames.has(cfg.name)) {
                cfg = null;
            }
            if (cfg && this.isSelfMiddlewareByOpts(cfg)) {
                this.willBeReorderdNames.add(cfg.name);
            }
            return cfg;
        });
        return optsList.filter(opts => opts !== null);
    }
    filterBeRordered(arr) {
        return arr.filter(opts => {
            return !this.willBeReorderdNames.has(opts.name);
        });
    }
    mergeSelfOptsWithUserReorderedOpts(arr) {
        return arr.map(opts => {
            if (this.willBeReorderdNames.has(opts.name)) {
                return this.makeOneSelfMiddlewareOpts(opts.name, opts);
            }
            return opts;
        });
    }
    getMiddlewareDir() {
        return path.join(this.userOptions.rootDir, 'middleware');
    }
    makeOneSelfMiddlewareOpts(name, newOpts) {
        assert('string' === typeof name, 'arguments[0] must be a string type!');
        assert(this.isSelfPrefix(name), 'it is not a internal middleware');
        const mdw = this.requireSelfMiddlewareByName(name);
        const opts = mdw.getMiddlewareOpts(newOpts);
        return opts;
    }
    requireSelfMiddlewareByName(name) {
        const rst = /^maius:(.*)$/.exec(name);
        debug('requireSelfMiddleware regexp result: %o', rst);
        assert(rst && rst[1], 'name regexp match error!');
        const Mdw = require(path.resolve(__dirname, '../lib/middleware', rst[1])).default;
        assert(index_1.isClass(Mdw), `Mdw ${rst[1]} is not class`);
        const mdw = new Mdw(this.maius);
        return mdw;
    }
    isSelfMiddlewareByOpts(opts) {
        return this.isSelfPrefix(opts.name);
    }
    isSelfPrefix(name) {
        return /^maius:/.test(name);
    }
}
exports.default = MiddlewareLoader;
