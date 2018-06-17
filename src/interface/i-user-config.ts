import ConfigMiddlewareItemModel from '../models/mdw-opts-model';

/**
 * Users config.js
 */

export default interface IUserConfig {
  env?: string;
  middleware?: IUserConfigMiddlewareOpts[];
  staticOpts: any;
  logger?: ILoggerConfig;
  views?: {
    engine: string;
    extension: string;
    dir: string;
    option?: object;
  };
}

/**
 * (alias) the item of config.middleware
 */

export type IUserConfigMiddlewareOpts = string | ConfigMiddlewareItemModel;

/**
 * Logger config
 */

export interface ILoggerConfig {
  directory?: string;
  level?: string;
  stdout?: boolean;
}
