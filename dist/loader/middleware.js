"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Debug = require("debug");
const fs = require("fs");
const path = require("path");
const static_1 = require("../lib/middleware/static");
const debug = Debug('maius:middlewareLoader');
const MIDDLEWARE = Symbol('middleware');
class MiddlewareLoader {
    constructor(maius) {
        this.options = maius.options;
        assert(this.options.rootDir);
        this.userConfig = maius.userConfig;
        this.maius = maius;
        this.selfBeforeMdw = [
            this.selfStaticMiddleware(),
        ];
        this.selfAfterMdw = [
            this.selfRouterMiddleware(),
        ];
    }
    getMiddleware() {
        if (this[MIDDLEWARE])
            return this[MIDDLEWARE];
        const middleware = [];
        const userMdwOpts = this.getMiddlewareConfig();
        const combinedMdwOpts = [
            ...this.selfBeforeMdw,
            ...userMdwOpts,
            ...this.selfAfterMdw,
        ];
        debug('combinedMiddleware: %O', combinedMdwOpts);
        const reorderedMdwOpts = this.reorderMiddlewareOpts(combinedMdwOpts);
        debug('reorderedMiddelware: %O', reorderedMdwOpts);
        reorderedMdwOpts.forEach((opts, index) => {
            const mdw = this.loadOneMiddleware(opts);
            middleware.push(mdw);
        });
        this[MIDDLEWARE] = middleware;
        return this[MIDDLEWARE];
    }
    getMiddlewareConfig() {
        const middleware = this.userConfig.middleware;
        assert(Array.isArray(middleware), '[config] middleware property must be an array type.');
        return this.userConfig.middleware.map((opts, index) => {
            const cfg = {
                _couldReorder: null,
                _filename: null,
                args: [],
                name: null,
            };
            if ('string' === typeof opts) {
                cfg.name = opts;
            }
            else {
                assert(typeof opts.name === 'string', `[config] middleware[${index}].name need string type value`);
                cfg.name = opts.name;
                cfg.args = opts.args;
            }
            cfg._filename = path.join(this.getMiddlewareDir(), `${cfg.name}.js`);
            return cfg;
        });
    }
    getMiddlewareDir() {
        return path.join(this.options.rootDir, 'middleware');
    }
    loadOneMiddleware(opts) {
        debug('Load one middleware: %o', opts);
        let fn = null;
        if ('function' === typeof opts.load) {
            fn = opts.load(this.maius.app);
        }
        else {
            const func = fs.statSync(opts._filename) ?
                require(opts._filename) :
                require(opts.name);
            assert(typeof func === 'function', `middleware ${opts.name} must be an function, but it is ${func}`);
            fn = func.apply(func, opts.args);
        }
        return fn;
    }
    reorderMiddlewareOpts(arr) {
        const reorderedNames = new Set();
        const removed = [];
        arr.forEach(opts => {
            if (opts._couldReorder)
                return;
            if (this.isSelfMiddleware(opts)) {
                reorderedNames.add(opts.name);
            }
        });
        const filted = arr.filter(opt => {
            if (opt._couldReorder && reorderedNames.has(opt.name)) {
                removed.push(opt);
                return false;
            }
            return true;
        });
        return filted.map(opt => {
            if (!this.isSelfMiddleware(opt))
                return opt;
            const removedMdw = this.findSelfMiddlewareOpt(removed, opt.name, true);
            if (!removedMdw) {
                return opt;
            }
            return this.assignOpt(removedMdw, opt);
        });
    }
    findSelfMiddlewareOpt(arr, name, reorder) {
        let cfg = null;
        arr.forEach(opt => {
            if (name === opt.name && !!reorder === opt._couldReorder) {
                cfg = opt;
            }
        });
        return cfg;
    }
    assignOpt(opt1, opt2) {
        const cfg = {
            _couldReorder: null,
            _filename: null,
            args: null,
            load: null,
            name: null,
        };
        return Object.assign(cfg, opt1, opt2);
    }
    isSelfMiddleware(opts) {
        return /^maius:/.test(opts.name);
    }
    selfStaticMiddleware() {
        const publicPath = path.join(this.options.rootDir, 'public');
        try {
            fs.readdirSync(publicPath);
        }
        catch (e) {
            return;
        }
        return {
            _couldReorder: true,
            load: () => {
                return static_1.default(publicPath, this.userConfig.static);
            },
            name: 'maius:static',
        };
    }
    selfRouterMiddleware() {
        return {
            _couldReorder: true,
            load: () => {
                return this.maius.router.routes();
            },
            name: 'maius:router',
        };
    }
}
exports.default = MiddlewareLoader;
