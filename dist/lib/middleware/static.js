"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serve = require("koa-static");
const path = require("path");
const user_config_1 = require("../../loader/user-config");
const mdw_opts_model_1 = require("../../models/mdw-opts-model");
const type_1 = require("../../utils/type");
const base_1 = require("./base");
class Static extends base_1.BaseMiddleware {
    constructor(maius) {
        super(maius);
        this.userConfig = user_config_1.default.getIntance().config;
        this.userOptions = user_config_1.default.getIntance().options;
        this.staticConfig = this.userConfig.static;
    }
    getMiddlewareOpts(opts) {
        const loadList = [];
        const cfg = new mdw_opts_model_1.default();
        cfg.name = 'maius:static';
        cfg._couldReorder = true;
        if ('string' === typeof this.staticConfig) {
            loadList.push({
                opts: {},
                root: this.staticConfig,
            });
        }
        else if (Array.isArray(this.staticConfig)) {
            for (const item of this.staticConfig) {
                if ('string' === typeof item) {
                    loadList.push({
                        opts: {},
                        root: item,
                    });
                    continue;
                }
                if ('object' === typeof item) {
                    loadList.push(item);
                }
            }
        }
        else {
            loadList.push({
                opts: {},
                root: path.join(this.userOptions.rootDir, 'public'),
            });
        }
        cfg.load = app => {
            for (const item of loadList) {
                const root = path.isAbsolute(item.root) ?
                    item.root :
                    path.join(this.userOptions.rootDir, item.root);
                app.use(serve(root, item.opts));
            }
        };
        const iopts = type_1.isObject(opts) ? opts : new mdw_opts_model_1.default();
        return this.merge(cfg, iopts);
    }
}
exports.default = Static;
