"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const fs = require("fs");
const path = require("path");
const plugin_one_1 = require("./plugin-one");
const debug = Debug('maius:PluginListLoader');
class PluginListLoader {
    constructor(app, pluginList) {
        this.app = app;
        this.pluginList = pluginList;
        this.appConfig = {};
        debug('Got plugin list will to load: %o', pluginList);
    }
    load() {
        for (let i = 0; i < this.pluginList.length; i += 1) {
            const { dirname, config } = this.pluginList[i];
            if (!path.isAbsolute(dirname)) {
                throw new Error(`[Maius PluginLoader]: Expect '${dirname}'`
                    + ' is a absolute path string in PluginLoader constructor second'
                    + ` parameter \`dirname[${i}]\``);
            }
            try {
                const stat = fs.statSync(dirname);
                if (!stat.isDirectory) {
                    console.warn(`[Maius] There is not ${dirname} folder.`);
                    continue;
                }
            }
            catch (error) {
                continue;
            }
            try {
                new plugin_one_1.default(this.app, dirname, config).load();
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    mergeConfig(targetConfig) {
        Object.assign(this.mergeConfig, targetConfig);
    }
}
exports.default = PluginListLoader;
