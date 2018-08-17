"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../../core/lib/router");
class MaiusRouter {
    constructor(app, plugConfig) {
        app.router = new router_1.default();
    }
}
exports.default = MaiusRouter;
