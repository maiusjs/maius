"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const fs = require("fs");
const path = require("path");
const debug = Debug('maius:userConfigLoader');
class UserConfigLoader {
    constructor(options) {
        this.options = options;
        this.config = this.getConfig();
    }
    static create(options) {
        if (UserConfigLoader.instance) {
            throw new Error(`UserConfigLoader has been instantiated!
Please call UserConfigLoader.getInstance() to get instance.`);
        }
        UserConfigLoader.instance = new UserConfigLoader(options);
        return UserConfigLoader.instance;
    }
    static getIntance() {
        if (!UserConfigLoader.instance) {
            throw new Error(`UserConfigLoader has not been instantiated!
      Please call UserConfigLoader.create(options) to instantiate a instance.`);
        }
        return UserConfigLoader.instance;
    }
    getConfig() {
        const filename = path.join(this.options.rootDir, 'config.js');
        if (!fs.statSync(filename)) {
            throw new Error('Not found config.js in project root directory!');
        }
        const config = require(filename);
        debug('User config: %o', config);
        return config;
    }
}
UserConfigLoader.instance = null;
exports.default = UserConfigLoader;
