"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("./type");
function callClassOrFn(content, args = []) {
    if (type_1.isClass(content)) {
        return new content(...args);
    }
    if (type_1.isClass(content.default)) {
        return new content.default(...args);
    }
    if (type_1.isFunction(content)) {
        return content(...args);
    }
    if (type_1.isFunction(content.default)) {
        return content.default(...args);
    }
    throw new Error('It is not class or function');
}
exports.default = callClassOrFn;
