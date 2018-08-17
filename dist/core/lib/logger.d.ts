import * as log4js from 'log4js';
import { IOptions } from '../../maius';
import { ILoggerConfig } from '../loader/config';
export default class Logger {
    static instance: Logger;
    static levels: typeof log4js.levels;
    static create(config: ILoggerConfig, options: IOptions): Logger;
    static getInstance(): Logger;
    constructor(config: ILoggerConfig, options: IOptions);
    getlogger(category?: any): log4js.Logger;
}
