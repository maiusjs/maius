import * as assert from 'assert';
import * as Debug from 'debug';
import * as fs from 'fs';
import { Middleware } from 'koa';
import * as path from 'path';
import IUserConfig from '../interface/i-user-config';
import IUserOptions from '../interface/i-user-options';

const debug = Debug('maius:middlewareLoader');
const MIDDLEWARE = Symbol('middleware');

export default class MiddlewareLoader {
  public options: IUserOptions;

  constructor(options) {
    this.options = options;
    assert(this.options.rootDir);
  }

  /**
   * Load the user's middleware according to config.js
   *
   * @returns {Object}
   *  {
   *    middleware,
   *    afterRouterMiddleware,
   *  }
   *
   * @since 0.1.0
   */

  public getMiddlewera():
  { middleware: Middleware[], afterRouterMiddleware: Middleware[] } {
    if (this[MIDDLEWARE]) return this[MIDDLEWARE];

    // 将中间件分成两种类型，根据 middleware.config[n].afterRouter 字段来区分
    // afterRouterMiddleware: 这一类的中间件将会在 router之后执行
    // middleware: 这一类的中间件将会在 router 之前执行

    const middleware: Middleware[] = [];
    const afterRouterMiddleware: Middleware[] = [];

    const config: IUserConfig = require(path.join(this.options.rootDir, 'config.js'));
    const middlewareDir = path.join(this.options.rootDir, 'middleware');
    const middlewareConfig = config.middleware;

    if (!middlewareConfig) {
      debug('%o', 'no custom middleware');
      return this[MIDDLEWARE];
    }

    // middlewareConfig 必须要求是数组
    if (!Array.isArray(middlewareConfig)) {
      debug('%o', 'no custom middleware');
      throw new Error('config.middleware must be an array');
    }

    // config.middleware 数组每一项下可以接受两种类型的值：string, object
    middlewareConfig.forEach((item, index) => {
      const cfg = {
        afterRouter: null,
        args: null,
        name: null,
      };

      if (typeof item === 'string') {
        cfg.name = item;
      } else {
        cfg.name = item.name;
      }

      cfg.afterRouter = cfg.afterRouter || false;
      cfg.args = cfg.args || [];

      if (typeof item !== 'string' && item.options) {
        cfg.args.push(item.options);
      }

      assert(
        cfg.name && typeof cfg.name === 'string',
        `middleware[${index}].name need string type value`,
      );

      const filename = path.join(middlewareDir, `${cfg.name}.js`);
      const func = fs.existsSync(filename) ?
        require(filename) :
        require(cfg.name);

      assert(typeof func === 'function', 'middleware must be an function');

      const fn = func.apply(this, cfg.args);

      if (!cfg.afterRouter) {
        middleware.push(fn);
        return;
      }

      afterRouterMiddleware.push(fn);
    });

    this[MIDDLEWARE] = {
      afterRouterMiddleware,
      middleware,
    };

    return this[MIDDLEWARE];
  }
}
