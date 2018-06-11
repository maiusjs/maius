"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const CONTENT = Symbol('content');
class UserConfigLoader {
    constructor(options) {
        this.options = options;
    }
    get config() {
        if (this[CONTENT]) {
            return this[CONTENT];
        }
        const filename = path.join(this.options.rootDir, 'config.js');
        if (!fs.statSync(filename)) {
            throw new Error('Not found config.js in project root directory!');
        }
        this[CONTENT] = require(filename);
        return this[CONTENT];
    }
}
exports.default = UserConfigLoader;
