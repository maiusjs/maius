"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accepts = require("accepts");
const assert = require("assert");
const Cookies = require("cookies");
const Debug = require("debug");
const fs = require("fs");
const http = require("http");
const KoaApplication = require("koa");
const path = require("path");
const base_context_1 = require("./core/lib/base-context");
const logger_1 = require("./core/lib/logger");
const config_1 = require("./core/loader/config");
const controller_1 = require("./core/loader/controller");
const middleware_1 = require("./core/loader/middleware");
const plugin_1 = require("./core/loader/plugin/plugin");
const service_1 = require("./core/loader/service");
const debug = Debug('maius:maius');
const CONTROLLER_LOADER = Symbol('controller_loader');
const SERVICE_LOADER = Symbol('service_loader');
const dirname = {
    CONFIG: 'src/config',
    CONTROLLER: 'src/controller',
    MIDDLEWARE: 'src/middleware',
    PLUGIN: 'src/plugin',
    ROUTER: 'src/router.js',
    SERVICE: 'src/service',
    STATIC: 'public',
    VIEW: 'view',
};
class Maius extends KoaApplication {
    constructor(options) {
        super();
        this.errorHandler();
        assert(typeof options.rootDir === 'string', 'options.rootDir config error!');
        this.dirname = dirname;
        this.options = options;
        this.config = new config_1.default(path.join(this.options.rootDir, dirname.CONFIG)).getConfig();
        debug('maius config: %o', this.config);
        this.logger = this.getLogger();
        this.env = this.config.env;
        const pluginLoader = new plugin_1.default(this);
        pluginLoader.loadPlugin([
            { name: 'maius-logger' },
            { name: 'maius-view' },
            { name: 'maius-static', options: [
                    path.join(this.options.rootDir, dirname.STATIC),
                ] },
        ]);
        pluginLoader.loadExternalPlugin();
        this.useMiddleware();
        pluginLoader.loadPlugin([
            { name: 'maius-router' },
        ]);
        this.controller = this.controllerLoader.getIntancesCol();
        debug('this.controller %o', this.controller);
        this.service = this.serviceLoader.getIntancesCol();
        debug('this.service %o', this.service);
        this.loadUserRoutes();
    }
    listen(...args) {
        return new Promise((resolve, reject) => {
            if (args.length === 0) {
                args[0] = this.options.port || 3123;
                if (args[0] === 3123) {
                    this.logger.info('The application will running at default port: 3123');
                }
            }
            const server = http.createServer(this.callback());
            server.listen(...args, e => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve();
            });
        });
    }
    createContext(req, res) {
        const context = Object.create(this.context);
        this.ctx = context;
        const request = (context.request = Object.create(this.request));
        const response = (context.response = Object.create(this.response));
        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        context.originalUrl = request.originalUrl = req.url;
        context.cookies = new Cookies(req, res, {
            keys: this.keys,
            secure: request.secure,
        });
        request.ip = request.ips[0] || req.socket.remoteAddress || '';
        context.accept = request.accept = accepts(req);
        context.state = {};
        return context;
    }
    getLogger() {
        const opts = this.config.logger
            ? this.config.logger
            : {
                directory: path.join(this.options.rootDir, 'logs'),
                level: 'DEBUG',
            };
        return logger_1.default.create(opts, this.options).getlogger();
    }
    get controllerLoader() {
        if (this[CONTROLLER_LOADER]) {
            return this[CONTROLLER_LOADER];
        }
        this[CONTROLLER_LOADER] = new controller_1.default(this, {
            path: path.join(this.options.rootDir, dirname.CONTROLLER),
        });
        return this[CONTROLLER_LOADER];
    }
    get serviceLoader() {
        if (this[SERVICE_LOADER]) {
            return this[SERVICE_LOADER];
        }
        this[SERVICE_LOADER] = new service_1.default(this, {
            path: path.join(this.options.rootDir, dirname.SERVICE),
        });
        return this[SERVICE_LOADER];
    }
    useMiddleware() {
        const dir = path.join(this.options.rootDir, dirname.MIDDLEWARE);
        const middlewareLoader = new middleware_1.default(this, dir, this.config.middleware);
        middlewareLoader.load();
    }
    loadUserRoutes() {
        const filename = path.join(this.options.rootDir, dirname.ROUTER);
        if (!fs.existsSync(filename)) {
            debug(`Not found routes ${filename}`);
            return;
        }
        const router = require(filename);
        assert('function' === typeof router, 'router.js must be a function type!');
        router({
            controller: this.controller,
            router: this.router,
        });
    }
    errorHandler() {
        this.on('error', e => {
            this.logger.error(e);
        });
    }
}
Maius.Controller = base_context_1.default;
Maius.Service = base_context_1.default;
Maius.Logger = logger_1.default;
exports.default = Maius;
module.exports = Maius;
module.exports.default = Maius;
