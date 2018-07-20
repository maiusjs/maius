import * as log4js from 'log4js';
import { ILoggerConfig } from '../interface/i-user-config';
export default class Logger {
    static instance: Logger;
    static levels: typeof log4js.levels;
    static create(config: ILoggerConfig): Logger;
    static getInstance(): Logger;
    constructor(config: ILoggerConfig);
    getlogger(category?: any): log4js.Logger;
}
