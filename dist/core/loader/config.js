"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const fs = require("fs");
const path = require("path");
const type_1 = require("../utils/type");
const debug = Debug('maius:PluginConfigLoader');
const log = {
    loadFileError(filename, error) {
        console.warn(`Load config error in the file: ${filename}\n`, error);
    },
};
class ConfigLoader {
    constructor(dirname) {
        this.dirname = dirname;
        this.config = null;
    }
    getConfig() {
        if (this.config)
            return this.config;
        this.config = this.mergeMultiUserConfig(this.dirname);
        return this.config;
    }
    mergeMultiUserConfig(dirname) {
        const config = {};
        const defaultConfigFilePath = path.join(dirname, 'config.js');
        const dirList = [];
        let fileList;
        try {
            fileList = fs.readdirSync(dirname);
        }
        catch (error) {
            debug('Not found config root directory: %s', dirname);
            return {};
        }
        try {
            const content = require(defaultConfigFilePath);
            if (type_1.isObject(content)) {
                Object.assign(config, content);
            }
        }
        catch (error) {
        }
        for (let i = 0; i < fileList.length; i += 1) {
            const name = fileList[i];
            const filepath = path.join(dirname, name);
            const stat = fs.statSync(filepath);
            const isFile = stat.isFile();
            const isDirectory = stat.isDirectory();
            try {
                if (isFile) {
                    this.mergeConfigByFile(filepath, config);
                }
                else if (isDirectory) {
                    dirList.push(filepath);
                }
            }
            catch (e) {
                continue;
            }
        }
        for (let i = 0; i < dirList.length; i += 1) {
            const filepath = dirList[i];
            this.mergeConfigFolder(filepath, config);
        }
        return config;
    }
    mergeConfigByFile(filepath, config) {
        let content = null;
        const basename = path.basename(filepath, path.extname(filepath));
        try {
            content = require(filepath);
            const rst = /^[a-zA-Z_$][\w$]*$/.exec(basename);
            if (!rst) {
                throw new Error(`Mounting config property failed.
Please make sure that the config file name dose not contain illegal characters of javascript.`);
            }
            if (basename === 'config') {
                return;
            }
            config[basename] = content;
        }
        catch (error) {
            log.loadFileError(filepath, error);
        }
    }
    mergeConfigFolder(dirPath, config) {
        const supportInnerDir = ['env'];
        const basename = path.basename(dirPath, path.extname(dirPath));
        if (supportInnerDir.indexOf(basename) < 0) {
            return;
        }
        if (basename === 'env') {
            this.folderEnv(dirPath, config);
        }
    }
    folderEnv(dirPath, config) {
        const envFileList = fs.readdirSync(dirPath);
        for (let i = 0; i < envFileList.length; i += 1) {
            const envFilename = envFileList[i];
            const env = path.basename(envFilename, path.extname(envFilename));
            if (process.env.NODE_ENV !== env)
                continue;
            const stat = fs.statSync(path.join(dirPath, envFilename));
            if (!stat.isFile()) {
                continue;
            }
            try {
                const content = require(path.join(dirPath, envFilename));
                if (!type_1.isObject(content))
                    continue;
                Object.assign(config, content);
            }
            catch (e) {
                continue;
            }
        }
    }
}
exports.default = ConfigLoader;
