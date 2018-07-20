"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseContext {
    constructor(maius) {
        this.app = maius;
        this.ctx = maius.ctx;
    }
    get controller() {
        return this.app.controller;
    }
    get service() {
        return this.app.service;
    }
    get httpClient() {
        return this.app.httpClient;
    }
}
exports.default = BaseContext;
