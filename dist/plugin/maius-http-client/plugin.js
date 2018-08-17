"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpclient_1 = require("../../core/lib/httpclient");
class MaiusHttpClient {
    constructor(app) {
        this.app = app;
        this.app.httpClient = httpclient_1.httpClient;
    }
}
exports.default = MaiusHttpClient;
