"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const fs = require("fs");
const path = require("path");
const plugin_list_1 = require("./plugin-list");
const debug = Debug('maius:PluginLoader');
class PluginLoader {
    constructor(app) {
        this.app = app;
        const APP_PATH = this.app.options.rootDir;
        const APP_PROJECT_ROOT = this.lookupProjectRoot(APP_PATH);
        const MAIUS_INTERNAL_PLUGIN_PATH = path.resolve(__dirname, '../../../plugin');
        const MAIUS_PROJECT_ROOT = this.lookupProjectRoot(path.resolve(__dirname));
        this.lookArray = [
            path.join(APP_PATH, this.app.dirname.PLUGIN),
            path.join(APP_PROJECT_ROOT, 'node_modules'),
            path.join(MAIUS_INTERNAL_PLUGIN_PATH),
            path.join(MAIUS_PROJECT_ROOT, 'node_modules'),
        ];
    }
    loadInteralPlugin() {
    }
    loadExternalPlugin() {
        const pluginConfigList = this.app.config.plugin;
        if (!Array.isArray(pluginConfigList)) {
            return;
        }
        this.loadPlugin(pluginConfigList);
    }
    loadPlugin(configList) {
        if (!configList
            || !Array.isArray(configList)
            || !configList.length) {
            throw new Error('Expect an array as the parameter');
        }
        const loadList = [];
        for (let i = 0; i < configList.length; i += 1) {
            const config = configList[i];
            const dirname = this.lookupPath(config.name);
            if (dirname) {
                loadList.push({ dirname, config });
            }
            else {
                console.warn('Not fount plugin', config.name);
            }
        }
        new plugin_list_1.default(this.app, loadList).load();
    }
    lookupPath(name) {
        for (let i = 0; i < this.lookArray.length; i += 1) {
            const lookPath = this.lookArray[i];
            if (fs.existsSync(path.join(lookPath))) {
                const target = this.find(lookPath, name);
                if (target)
                    return target;
            }
        }
    }
    find(dir, target) {
        try {
            const dirs = fs.readdirSync(dir);
            for (let n = 0; n < dirs.length; n += 1) {
                if (dirs[n] === target) {
                    return path.join(dir, target);
                }
            }
        }
        catch (error) {
            return null;
        }
    }
    lookupProjectRoot(dir) {
        try {
            const list = fs.readdirSync(dir);
            for (let i = 0; i < list.length; i += 1) {
                const name = list[i];
                if (name === 'package.json') {
                    return dir;
                }
            }
            return this.lookupProjectRoot(path.join(dir, '../'));
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.default = PluginLoader;
