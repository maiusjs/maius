"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const fs = require("fs");
const path = require("path");
const call_class_or_fn_1 = require("../../utils/call-class-or-fn");
const config_1 = require("../config");
const middleware_1 = require("../middleware");
const debug = Debug('maius:PluginOneLoader');
class PluginOneLoader {
    constructor(app, dirname, options) {
        this.app = app;
        this.dirname = dirname;
        this.options = options;
        this.directory = {
            config: path.join(this.dirname, 'config'),
            middleware: path.join(this.dirname, 'middleware'),
        };
        if (fs.existsSync(path.join(this.directory.config))) {
            this.config = new config_1.default(this.directory.config).getConfig();
        }
        else {
            this.config = {};
        }
    }
    load() {
        debug('load plugin - %s', this.options.name);
        this.callEntry();
        if (fs.existsSync(path.join(this.directory.middleware))
            && Array.isArray(this.config.middleware)) {
            new middleware_1.default(this.app, path.join(this.dirname, 'middleware'), this.config.middleware).load(this.options);
        }
    }
    callEntry() {
        let pluginPath = null;
        if (fs.existsSync(path.join(this.dirname, 'plugin.ts'))) {
            pluginPath = path.join(this.dirname, 'plugin.ts');
        }
        else if (fs.existsSync(path.join(this.dirname, 'plugin.js'))) {
            pluginPath = path.join(this.dirname, 'plugin.js');
        }
        else {
            return;
        }
        try {
            const content = require(pluginPath);
            call_class_or_fn_1.default(content, [this.app, this.options]);
        }
        catch (error) {
            console.error(error);
            throw new Error(`The plugin.(js|ts) is not a class or function in ${pluginPath}`);
        }
    }
}
exports.default = PluginOneLoader;
