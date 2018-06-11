import Application from '../lib/application';

/**
 * Users config.js
 */

export default interface IUserConfig {
  middleware?: IUserConfigMiddlewareOpts[];
  static: any;
}

/**
 * (alias) the item of config.middleware
 */

export type IUserConfigMiddlewareOpts = string | IUserConfigMiddlewareArrItem;

/**
 * config.middleware
 */

export interface IUserConfigMiddlewareArrItem {
  args?: any[];
  name: string;
  load?: (app: Application) => any;
  _couldReorder?: boolean;
  _filename?: string;
}
