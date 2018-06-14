"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdw_opts_model_1 = require("../../models/mdw-opts-model");
const base_1 = require("./base");
class RouterMdw extends base_1.BaseMiddleware {
    constructor(maius) {
        super(maius);
    }
    getMiddlewareOpts() {
        const opts = new mdw_opts_model_1.default();
        opts._couldReorder = true;
        opts.name = 'maius:router';
        opts.load = app => app.use(this.maius.router.routes());
        return opts;
    }
}
exports.default = RouterMdw;
