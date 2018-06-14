import * as log4js from 'log4js';
import { ILoggerConfig } from '../interface/i-user-config';

export default class Logger {

  public static instance: Logger;
  public static levels = log4js.levels;

  public static create(config: ILoggerConfig): Logger {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = new Logger(config);
    return Logger.instance;
  }

  public static getInstance(): Logger {
    return Logger.instance;
  }

  constructor(config: ILoggerConfig) {

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
          filename:  config.directory + '/errors.log',
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

  public getlogger(category?): log4js.Logger {
    return log4js.getLogger(category);
  }
}
