import * as Debug from 'debug';
import * as fs from 'fs';
import { Middleware } from 'koa';
import * as path from 'path';
import Maius from '../../maius';
import { isFunction } from '../utils/type';

const debug = Debug('maius:MiddlewareLoader2');

export interface IMiddlewareConfig {
  name: string | ((...args: any[]) => Middleware);
  args?: any[];
  options: any;
  disabled?: boolean;
}

export interface IMiddlewareFnCol {
  [x: string]: (...args: any[]) => Middleware;
}
/**
 * Get all middleware fn, and filtered illegal middleware, by `this.middlewareCol`
 */
export default class MiddlewareLoader {
  /**
   * @since 0.1.0
   */
  public middlewareFnCol: IMiddlewareFnCol;

  /**
   * A middleware config list, only contain safety config.
   * @since 0.1.0
   */
  public middlewareConfigList: IMiddlewareConfig[];

  private config: IMiddlewareConfig[];
  private app: Maius;

  /**
   * Get all middleware fn, and filtered illegal middleware, by `this.middlewareCol`
   *
   * @param app - maius appliction instance.
   * @param dirname - the middleware directory path.
   * @param config - middleware config list.
   */
  constructor(app: Maius, dirname: string, config: IMiddlewareConfig[]) {
    this.app = app;
    this.config = Array.isArray(config) ? config : [];
    this.middlewareConfigList = [];
    this.middlewareFnCol = this.collectMiddleware(dirname);

    this.handleMiddlewareConfig();

    debug('fitered config: %o', this.middlewareConfigList);
  }

  /**
   * load the middleware
   *
   * @param extendArgs the arguments third arugment and after.
   */
  public load(...extendArgs: any[]) {
    const execFnList: string[] = [];

    for (let i = 0; i < this.middlewareConfigList.length; i += 1) {
      const itemConfig: IMiddlewareConfig = this.middlewareConfigList[i];
      const name = itemConfig.name;
      let mdw: (...args: any[]) => Middleware = null;

      // name as Middleware
      if (isFunction(name)) {
        mdw = name as (...args: any[]) => Middleware;
        execFnList.push('[Function]');

      // name as string
      } else if ('string' === typeof name) {

        // not fount the middleware
        if (!this.middlewareFnCol[name]) {
          console.warn('Not fount the middlware %s', name);
          continue;
        }

        mdw = this.middlewareFnCol[name];
        execFnList.push(name);
      } else {
        continue;
      }

      const args = itemConfig.args;
      const options = itemConfig.options;
      // use the middlware
      if (args) {
        this.app.use(mdw(...args));
      } else {
        this.app.use(mdw(options, this.app, ...extendArgs));
      }
    }
  }

  /**
   * @param dirname the middleware directory
   * @return
   */
  private collectMiddleware(dirname: string): IMiddlewareFnCol {
    const middlewareCol = {};
    let fileList: string[] = null;

    try {
      fileList = fs.readdirSync(dirname);
    } catch (error) {
      return middlewareCol;
    }

    for (let i = 0; i < fileList.length; i += 1) {
      const filename: string = fileList[i];
      const basename: string = path.basename(filename, path.extname(filename));
      const filepath: string = path.join(dirname, filename);

      // if this is a illegal middleware, will get a null as return value.
      const fn = this.requireMiddleware(filepath);

      if (fn) {
        middlewareCol[basename] = fn;
      }
    }

    return middlewareCol;
  }

  /**
   * Check is it a safe(legal) middleware function.
   *
   * @param filepath the middleware absolute path.
   * @return the middlware
   */
  private requireMiddleware(filepath): (Middleware | null) {
    try {
      const fn = require(filepath);
      if (isFunction(fn)) {
        return fn;
      }
      return null;
    } catch (error) {
      console.log();
      console.error(error);
      console.log();
      return null;
    }
  }

  /**
   * Push middleware into this.middleware in order, without
   * the middlware that the property enable is false.
   */
  private handleMiddlewareConfig() {

    for (let i = 0; i < this.config.length; i += 1) {
      const item = this.config[i];

      // check is it safety.
      if (!this.checkSafe(item, i)) {
        continue;
      }

      // this middleware had disabled
      if (item.disabled) {
        continue;
      }

      // push item into this.middleware
      this.proxyPushItem(item);
    }
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
    for (let i = 0; i < this.middlewareConfigList.length; i += 1) {
      const middlewareConfig = this.middlewareConfigList[i];

      // if there are two same middleware, the latter will replace the former.
      if (middlewareConfig.name === item.name) {
        this.middlewareConfigList.splice(i, 1, item);
        return;
      }
    }

    this.middlewareConfigList.push(item);
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

    if ('string' !== typeof name && 'function' !== typeof name) {
      console.warn(`Expect config.middleware[${index}].name is a string or function,\
but accept ${typeof name}.`);
      return false;
    }

    if (args && !Array.isArray(args)) {
      console.warn(`Expect config.middleware[${index}].args is an array,\
but accept ${typeof name}.`);
      return false;
    }

    if (disabled !== undefined && 'boolean' !== typeof disabled) {
      console.warn(`Expect config.middleware[${index}].disabled is a boolean,\
but accept ${typeof name}.`);
      return false;
    }

    return true;
  }
}
