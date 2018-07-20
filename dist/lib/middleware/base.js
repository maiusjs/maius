"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mdw_opts_model_1 = require("../../models/mdw-opts-model");
const type_1 = require("../../utils/type");
class BaseMiddleware {
    constructor(maius) {
        this.maius = maius;
    }
    merge(source, target) {
        assert(type_1.isObject(source), 'arguments[0] must be ConfigMiddlewareItemModel instance');
        assert(type_1.isObject(target), 'arguments[1] must be ConfigMiddlewareItemModel instance');
        const opts = new mdw_opts_model_1.default();
        opts.name = source.name;
        opts.args = target.args || source.args;
        opts._filename = target._filename || source._filename;
        opts._couldReorder = type_1.isBoolean(target._couldReorder) ?
            target._couldReorder :
            source._couldReorder;
        opts.load = type_1.isFunction(target.load) ?
            target.load :
            source.load;
        return opts;
    }
}
exports.BaseMiddleware = BaseMiddleware;
