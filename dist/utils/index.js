"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = (fn) => {
    const str = Object.prototype.toString.call(fn);
    return str === '[object Function]';
};
exports.isObject = (obj) => {
    const str = Object.prototype.toString.call(obj);
    return str === '[object Object]';
};
