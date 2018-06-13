"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Debug = require("debug");
const path = require("path");
const application_1 = require("./lib/application");
const base_context_1 = require("./lib/base-context");
const router_1 = require("./lib/router");
const controller_1 = require("./loader/controller");
const middleware_1 = require("./loader/middleware");
const service_1 = require("./loader/service");
const user_config_1 = require("./loader/user-config");
const debug = Debug('maius:maius');
const MIDDLEWARE_LOADER = Symbol('middleware_loader');
const CONTROLLER_LOADER = Symbol('controller_loader');
const SERVICE_LOADER = Symbol('service_loader');
const USER_CONFIG = Symbol('user_config');
class Maius {
    constructor(options) {
        assert(typeof options.rootDir === 'string', 'options.rootDir config error!');
        this.options = options;
        this.config = user_config_1.default.create(this.options).config;
        this.app = new application_1.default();
        this.router = new router_1.default();
        this.controller = this.controllerLoader.getIntancesCol();
        debug('this.controller %o', this.controller);
        this.service = this.serviceLoader.getIntancesCol();
        debug('this.service %o', this.service);
        this.setControllerAndServiceProps();
        this.loadUserRoutes();
        this.useMiddleware();
    }
    listen(port = this.options.port) {
        assert(typeof port === 'number', 'Maius.prototype.listen(port), port must be a number');
        return new Promise(resolve => {
            this.app.listen(port, () => resolve());
        });
    }
    get controllerLoader() {
        if (this[CONTROLLER_LOADER]) {
            return this[CONTROLLER_LOADER];
        }
        this[CONTROLLER_LOADER] = new controller_1.default({
            path: path.join(this.options.rootDir, 'controller'),
        });
        return this[CONTROLLER_LOADER];
    }
    get serviceLoader() {
        if (this[SERVICE_LOADER]) {
            return this[SERVICE_LOADER];
        }
        this[SERVICE_LOADER] = new service_1.default({
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
    setControllerAndServiceProps() {
        Object.keys(this.controller).forEach(key => {
            this.controller[key].bindController(this.controller);
            this.controller[key].bindService(this.service);
        });
        Object.keys(this.service).forEach(key => {
            this.service[key].bindController(this.controller);
            this.service[key].bindService(this.service);
        });
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
}
Maius.Controller = base_context_1.default;
Maius.Service = base_context_1.default;
exports.default = Maius;
module.exports = Maius;
