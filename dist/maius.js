"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accepts = require("accepts");
const assert = require("assert");
const Cookies = require("cookies");
const Debug = require("debug");
const http = require("http");
const KoaApplication = require("koa");
const path = require("path");
const base_context_1 = require("./lib/base-context");
const httpclient_1 = require("./lib/httpclient");
const logger_1 = require("./lib/logger");
const router_1 = require("./lib/router");
const controller_1 = require("./loader/controller");
const middleware_1 = require("./loader/middleware");
const service_1 = require("./loader/service");
const user_config_1 = require("./loader/user-config");
const debug = Debug('maius:maius');
const MIDDLEWARE_LOADER = Symbol('middleware_loader');
const CONTROLLER_LOADER = Symbol('controller_loader');
const SERVICE_LOADER = Symbol('service_loader');
class Maius extends KoaApplication {
    constructor(options) {
        super();
        this.errorHandler();
        assert(typeof options.rootDir === 'string', 'options.rootDir config error!');
        this.options = options;
        this.config = user_config_1.default.create(this.options).config;
        this.logger = logger_1.default.create({
            directory: this.config.logger.directory ||
                path.resolve(this.options.rootDir + './logs'),
            level: this.config.logger.level ||
                (this.config.env === 'dev' ? 'DEBUG' : 'ERROR'),
        }).getlogger();
        this.env = this.config.env;
        this.router = new router_1.default();
        this.httpClient = httpclient_1.httpClient;
        this.controller = this.controllerLoader.getIntancesCol();
        debug('this.controller %o', this.controller);
        this.service = this.serviceLoader.getIntancesCol();
        debug('this.service %o', this.service);
        this.loadUserRoutes();
        this.useMiddleware();
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
    get controllerLoader() {
        if (this[CONTROLLER_LOADER]) {
            return this[CONTROLLER_LOADER];
        }
        this[CONTROLLER_LOADER] = new controller_1.default(this, {
            path: path.join(this.options.rootDir, 'controller'),
        });
        return this[CONTROLLER_LOADER];
    }
    get serviceLoader() {
        if (this[SERVICE_LOADER]) {
            return this[SERVICE_LOADER];
        }
        this[SERVICE_LOADER] = new service_1.default(this, {
            path: path.join(this.options.rootDir, 'service'),
        });
        return this[SERVICE_LOADER];
    }
    get middlewareLoader() {
        if (this[MIDDLEWARE_LOADER]) {
            return this[MIDDLEWARE_LOADER];
        }
        this[MIDDLEWARE_LOADER] = new middleware_1.default(this);
        return this[MIDDLEWARE_LOADER];
    }
    useMiddleware() {
        this.middlewareLoader.useAllMiddleware();
    }
    loadUserRoutes() {
        const router = require(path.join(this.options.rootDir, 'router.js'));
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
