import { Middleware } from 'koa';
import Maius from '../../maius';

export interface IMiddlewareConfig {
  name: string | ((...args: any[]) => Middleware);
  args?: any[];
  disabled?: boolean;
}

export default class MiddlewareFolderLoader {
  public middlewareList: IMiddlewareConfig[];
  private config: object;

  /**
   * Create middleware folder loader of one folder.
   *
   * @param dirname - middleware directory path
   * @param config - all middlware config obj
   * @param app - the instance of maius
   */
  constructor(config: object, app: Maius) {
    this.config = config;
    this.middlewareList = [];

    this.handleMiddlewareCol();
  }

  /**
   * Use this method instead of this.middlwareList.push.
   * This method will filter some middleware config by follow condition:
   *    1. if there are same name between two middleware. the latter will
   *       replace the former.
   *
   * @param item - one middleware config
   */
  private proxyPushItem(item) {
    for (let i = 0; i < this.middlewareList.length; i += 1) {
      const middlewareConfig = this.middlewareList[i];

      // the latter will replace the former.
      if (middlewareConfig.name === item.name) {
        this.middlewareList.splice(i, 1, item);
        return;
      }
    }

    this.middlewareList.push(item);
  }

  /**
   * Push middleware into this.middleware in order, without
   * the middlware that the property enable is false.
   */
  private handleMiddlewareCol() {
    const keys = Object.keys(this.config);

    for (let i = 0; i < keys.length; i += 1) {
      const item = this.config[keys[i]];

      // check is it safety.
      if (!this.checkSafe(item, i)) continue;

      // this middleware had disabled
      if (item.disabled) return;

      // push item into this.middleware
      this.proxyPushItem(item);
    }
  }

  /**
   * Check is a middleware config safe
   *    1. name     <string | Fcuntion>
   *    2. args     <any[] | undefined>
   *    2. disabled <boolean | undefined>
   *
   * @param config - one middleware config
   */
  private checkSafe(config, index) {
    const { name, args, disabled } = config;

    if ('string' !== typeof name) {
      console.warn(`Expected config.middleware[${index}].name is a string or function,
  but accept ${typeof name}`);
      return false;
    }

    if (args && !Array.isArray(args)) {
      console.warn(`Expected config.middleware[${index}].args is an array,
  but accept ${typeof name}`);
      return false;
    }

    if (disabled !== undefined && 'boolean' !== typeof disabled) {
      console.warn(`Expected config.middleware[${index}].disabled is a boolean,
  but accept ${typeof name}`);
      return false;
    }

    return true;
  }
}
