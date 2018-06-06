import * as assert from 'assert';
import * as Debug from 'debug';
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
  { middleware: (() => void)[], afterRouterMiddleware: (() => void)[] } {
    if (this[MIDDLEWARE]) return this[MIDDLEWARE];

    // 将中间件分成两种类型，根据 middleware.config[n].afterRouter 字段来区分
    // afterRouterMiddleware: 这一类的中间件将会在 router之后执行
    // middleware: 这一类的中间件将会在 router 之前执行

    const middleware: (() => void)[] = [];
    const afterRouterMiddleware: (() => void)[] = [];

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
      // 第一种情况：string
      if (typeof item === 'string') {
        const func = require(path.join(middlewareDir, `${item}.js`));
        assert(typeof func === 'function', 'middleware must be an function');

        middleware.push(func());
        return;
      }

      // 第二种：Object { name, options, afterRouter }
      assert(
        item.name && typeof item.name === 'string',
        `middleware[${index}].name need string type value`,
      );

      const opt = {
        afterRouter: item.afterRouter || false,
        name: item.name,
        options: item.options,
      };

      const fn = require(path.join(middlewareDir, `${opt.name}.js`));
      assert(typeof fn === 'function', 'middleware must be an function');

      if (!opt.afterRouter) {
        middleware.push(fn(opt.options));
        return;
      }

      afterRouterMiddleware.push(fn(opt.options));
    });

    this[MIDDLEWARE] = {
      afterRouterMiddleware,
      middleware,
    };

    return this[MIDDLEWARE];
  }
}
