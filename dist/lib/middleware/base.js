"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mdw_opts_model_1 = require("../../models/mdw-opts-model");
const utils_1 = require("../../utils");
class BaseMiddleware {
    constructor(maius) {
        this.maius = maius;
    }
    merge(source, target) {
        assert(utils_1.isObject(source), 'arguments[0] must be ConfigMiddlewareItemModel instance');
        assert(utils_1.isObject(source), 'arguments[1] must be ConfigMiddlewareItemModel instance');
        const opts = new mdw_opts_model_1.default();
        opts.name = source.name;
        opts.args = target.args || source.args;
        opts._filename = target._filename || source._filename;
        opts._couldReorder = utils_1.isBoolean(target._couldReorder) ?
            target._couldReorder :
            source._couldReorder;
        opts.load = utils_1.isFunction(target.load) ?
            target.load :
            source.load;
        return opts;
    }
}
exports.BaseMiddleware = BaseMiddleware;
