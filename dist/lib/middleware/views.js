"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Debug = require("debug");
const koaViews = require("koa-views");
const path = require("path");
const user_config_1 = require("../../loader/user-config");
const mdw_opts_model_1 = require("../../models/mdw-opts-model");
const index_1 = require("../../utils/index");
const base_1 = require("./base");
const debug = Debug('maius:viewsMiddlware');
class Static extends base_1.BaseMiddleware {
    constructor(maius) {
        super(maius);
        this.userConfig = user_config_1.default.getIntance().config;
        this.userOptions = user_config_1.default.getIntance().options;
        this.supportMap = new Map([
            ['ejs', { engine: 'ejs', extension: 'ejs', dir: 'views' }],
            ['nunjucks', { engine: 'nunjucks', extension: 'html', dir: 'views' }],
        ]);
        this.viewsConfig = this.makeViewsConfig();
    }
    getMiddlewareOpts(opts) {
        const cfg = new mdw_opts_model_1.default();
        cfg.name = 'maius:views';
        cfg._couldReorder = true;
        cfg.load = app => {
            app.use(koaViews(this.viewsDir(), this.viewsConfig));
        };
        const iopts = index_1.isObject(opts) ? opts : new mdw_opts_model_1.default();
        return this.merge(cfg, iopts);
    }
    viewsDir() {
        return path.join(this.userOptions.rootDir, this.viewsConfig.dir);
    }
    makeViewsConfig() {
        const userConfig = this.userConfig.views;
        const engine = (userConfig && userConfig.engine) || 'ejs';
        const config = this.supportMap.get(engine);
        assert(config, 'the framework does not find the view engine you want to use,' +
            'use ejs view engine by default');
        config.dir = (userConfig && userConfig.dir) || config.dir;
        config.extension = (userConfig && userConfig.extension) || config.extension;
        debug('engineConfig %o', config);
        return config;
    }
}
exports.default = Static;
