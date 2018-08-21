import * as log4js from 'log4js';
import * as path from 'path';
import { IOptions } from '../../maius';
import { ILoggerConfig } from '../loader/config';

export default class Logger {

  public static instance: Logger;
  public static levels = log4js.levels;

  public static create(config: ILoggerConfig, options: IOptions): Logger {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = new Logger(config, options);
    return Logger.instance;
  }

  public static getInstance(): Logger {
    return Logger.instance;
  }

  constructor(config: ILoggerConfig, options: IOptions) {
    const level: string = config.level || 'DEBUG';
    let directory: string;

    if (config.directory) {
      directory = path.isAbsolute(config.directory)
        ? config.directory
        : path.join(options.rootDir, config.directory);
    } else {
      directory = path.resolve(options.rootDir, 'logs');
    }

    const defAppenders = [];
    if ((config.level === 'DEBUG' && typeof config.stdout === 'undefined') ||
      config.stdout) {
      defAppenders.push('stdout');
    }

    log4js.configure({
      appenders: {
        access: {
          category: 'http',
          filename: path.join(directory, '/access.log'),
          pattern: '-yyyy-MM-dd',
          type: 'dateFile',
        },
        app: {
          filename: path.join(directory, '/app.log'),
          maxLogSize: 1048 * 1048,
          numBackups: 5,
          type: 'file',
        },
        errorFile: {
          filename:  path.join(directory, '/errors.log'),
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
        default: { level, appenders: ['app', 'errors', ...defAppenders] },
        http: { level, appenders: ['access'] },
      },
    });
  }

  public getlogger(category?): log4js.Logger {
    return log4js.getLogger(category);
  }
}
