"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const Debug = require("debug");
const fs = require("fs");
const path = require("path");
const type_1 = require("../utils/type");
const debug = Debug('maius:baseLoader');
class BaseLoader {
    constructor(maius, options) {
        assert(options.path, 'options.path cannot be ignored');
        this.path = options.path;
        this.maius = maius;
    }
    getIntancesCol() {
        const col = Object.create({});
        this.getFiles().forEach(item => {
            debug('Loading file: %o', item);
            const UserClass = require(item.path);
            debug('file export: %o', UserClass);
            if (type_1.isFunction(UserClass)) {
                col[item.name] = this.wrapClass(UserClass);
            }
            else if (type_1.isObject(UserClass) && type_1.isFunction(UserClass.default)) {
                col[item.name] = this.wrapClass(UserClass.default);
            }
            else if (type_1.isObject(UserClass)) {
                col[item.name] = this.wrapObject(UserClass);
            }
            else {
                throw new Error(`${item.name}.js is not a class function`);
            }
        });
        return col;
    }
    getFiles() {
        const dir = this.path;
        let list = null;
        try {
            list = fs.readdirSync(dir);
        }
        catch (error) {
            debug(`Cannot find "${dir}" directory.`);
            return [];
        }
        const files = list
            .filter(item => /.*?\.js$/.test(item))
            .map(item => {
            return {
                name: /(.*?)\.js$/.exec(item)[1],
                path: path.join(dir, item),
            };
        });
        return files;
    }
    wrapClass(UserClass) {
        const instance = new UserClass(this.maius);
        const bindedMethods = [];
        let proto = Object.getPrototypeOf(instance);
        while (proto !== Object.prototype) {
            const keys = Object.getOwnPropertyNames(proto);
            debug('wrap class keys array: %o', keys);
            for (const key of keys) {
                if (key === 'constructor')
                    continue;
                const d = Object.getOwnPropertyDescriptor(proto, key);
                if (type_1.isFunction(d.value) && bindedMethods.indexOf(key) < 0) {
                    debug('pushed key: %s', key);
                    bindedMethods.push(key);
                    instance[key] = proto[key].bind(instance);
                }
            }
            proto = Object.getPrototypeOf(proto);
        }
        return instance;
    }
    wrapObject(obj) {
        const keys = Object.keys(obj);
        debug('wrap object keys array: %o', keys);
        for (const key of keys) {
            if (type_1.isFunction(obj[key])) {
                obj[key] = obj[key].bind(obj);
            }
            else if (type_1.isObject(obj[key])) {
                this.wrapObject(obj[key]);
            }
        }
        return obj;
    }
}
exports.default = BaseLoader;
