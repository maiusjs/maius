"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isSomething = (...types) => {
    return arg => {
        for (const type of types) {
            if ({}.toString.call(arg) === `[object ${type}]`) {
                return true;
            }
        }
        return false;
    };
};
exports.isFunction = isSomething('Function', 'AsyncFunction');
exports.isObject = isSomething('Object');
exports.isBoolean = isSomething('Boolean');
exports.isClass = (arg, className) => {
    if ('function' !== typeof arg)
        return false;
    const reg = new RegExp(`^\\s*class\\s+${className ? className + '\\b' : ''}`);
    return typeof arg === 'function' && reg.test(arg.toString());
};
