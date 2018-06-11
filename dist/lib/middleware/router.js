"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KoaRouter = require("koa-router");
class Router extends KoaRouter {
    constructor(opts) {
        super(opts);
    }
    resources(...args) { }
}
exports.default = Router;
