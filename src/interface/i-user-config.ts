import Application from '../lib/application';
import ConfigMiddlewareItemModel from '../models/mdw-opts-model';

/**
 * Users config.js
 */

export default interface IUserConfig {
  middleware?: IUserConfigMiddlewareOpts[];
  staticOpts: any;
  views: {
    engine: string;
    extension: string;
    dir: string;
  };
}

/**
 * (alias) the item of config.middleware
 */

export type IUserConfigMiddlewareOpts = string | ConfigMiddlewareItemModel;
