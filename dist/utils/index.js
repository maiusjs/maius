"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isSomething = (type) => {
    return arg => {
        return {}.toString.call(arg) === `[object ${type}]`;
    };
};
exports.isFunction = isSomething('Function');
exports.isObject = isSomething('Object');
exports.isBoolean = isSomething('Boolean');
exports.isClass = (cls, name) => {
    const reg = new RegExp(`^\\s*class\\s+${name ? name + '\\b' : ''}`);
    return typeof cls === 'function' && reg.test(cls.toString());
};
