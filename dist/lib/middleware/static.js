"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const serve = require("koa-static");
const path = require("path");
const user_config_1 = require("../../loader/user-config");
const mdw_opts_model_1 = require("../../models/mdw-opts-model");
const index_1 = require("../../utils/index");
const base_1 = require("./base");
class Static extends base_1.BaseMiddleware {
    constructor(maius) {
        super(maius);
        this.userConfig = user_config_1.default.getIntance().config;
        this.userOptions = user_config_1.default.getIntance().options;
        this.staticPath = path.join(this.userOptions.rootDir, 'public');
    }
    getMiddlewareOpts(opts) {
        const cfg = new mdw_opts_model_1.default();
        const publicPath = path.join(this.userOptions.rootDir, 'public');
        try {
            fs.readdirSync(publicPath);
        }
        catch (e) {
        }
        cfg.name = 'maius:static';
        cfg._couldReorder = true;
        cfg.load = app => app.use(serve(this.staticPath, this.staticOpts));
        const iopts = index_1.isObject(opts) ? opts : new mdw_opts_model_1.default();
        return this.merge(cfg, iopts);
    }
}
exports.default = Static;
