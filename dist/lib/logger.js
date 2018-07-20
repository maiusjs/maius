"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
class Logger {
    constructor(config) {
        config.level = config.level || 'DEBUG';
        config.directory = config.directory || './';
        const defAppenders = [];
        if ((config.level === 'DEBUG' && typeof config.stdout === 'undefined') ||
            config.stdout) {
            defAppenders.push('stdout');
        }
        log4js.configure({
            appenders: {
                access: {
                    category: 'http',
                    filename: config.directory + '/access.log',
                    pattern: '-yyyy-MM-dd',
                    type: 'dateFile',
                },
                app: {
                    filename: config.directory + '/app.log',
                    maxLogSize: 1048 * 1048,
                    numBackups: 5,
                    type: 'file',
                },
                errorFile: {
                    filename: config.directory + '/errors.log',
                    type: 'file',
                },
                errors: {
                    appender: 'errorFile',
                    level: 'ERROR',
                    type: 'logLevelFilter',
                },
                stdout: { type: 'stdout' },
            },
            categories: {
                default: { appenders: ['app', 'errors', ...defAppenders], level: config.level },
                http: { appenders: ['access'], level: config.level },
            },
        });
    }
    static create(config) {
        if (Logger.instance) {
            return Logger.instance;
        }
        Logger.instance = new Logger(config);
        return Logger.instance;
    }
    static getInstance() {
        return Logger.instance;
    }
    getlogger(category) {
        return log4js.getLogger(category);
    }
}
Logger.levels = log4js.levels;
exports.default = Logger;
