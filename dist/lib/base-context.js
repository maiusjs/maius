"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseContext {
    bindService(service) {
        this.service = service;
    }
    bindController(controller) {
        this.controller = controller;
    }
}
exports.default = BaseContext;
