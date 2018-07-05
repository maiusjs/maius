import * as assert from 'assert';
import * as Debug from 'debug';
import * as fs from 'fs';
import { Middleware } from 'koa';
import * as path from 'path';
import IUserConfig from '../interface/i-user-config';
import IUserOptions from '../interface/i-user-options';
import { BaseMiddleware } from '../lib/middleware/base';
import Maius from '../maius';
import MdwOptsModel from '../models/mdw-opts-model';
import { isClass, isFunction } from '../utils/type';
import UserConfigLoader from './user-config';

const debug = Debug('maius:middlewareLoader');
const MIDDLEWARE = Symbol('middleware');

/**
 * It not only load users middleware, but also load maius' internal middleware.
 */

export default class MiddlewareLoader {
  private maius: Maius;
  private userOptions: IUserOptions;
  private userConfig: IUserConfig;
  private selfBeforeMdw: MdwOptsModel[];
  private selfAfterMdw: MdwOptsModel[];
  private willBeReorderdNames: Set<string>;

  /**
   * @constructor
   * @param options users options
   */

  constructor(maius: Maius) {
    /**
     * @private
     */
    this.userOptions = UserConfigLoader.getIntance().options;
    assert(this.userOptions.rootDir);

    /**
     * @private
     */
    this.userConfig = UserConfigLoader.getIntance().config;

    /**
     * @private
     */
    this.maius = maius;

    /**
     * this.selfBeforeMdw: It will be loaded before users middleware.
     * this.selfAfterMdw: It will be loaded after users middleware.
     *
     * User could reorder those middlware, by setting 'maius:xx' in config.js.
     *
     * @private
     */
    this.selfBeforeMdw = [
      this.makeOneSelfMiddlewareOpts('maius:static'),
      this.makeOneSelfMiddlewareOpts('maius:views'),
    ];

    /**
     * Same as above.
     *
     * @private
     */
    this.selfAfterMdw = [
      this.makeOneSelfMiddlewareOpts('maius:router'),
    ];

    this.willBeReorderdNames = new Set();
  }

  /**
   * to use all middleware one by one
   */

  public useAllMiddleware(): void {
    this.getAllMiddlewareOpts().forEach(opts => {

      debug('Load one middleware: %o', opts);
      let fn: Middleware = null;

      // Customize middleware load method
      if ('function' === typeof opts.load) {
        opts.load(this.maius);

      // The common way to load middleware.
      } else {
        // const realPath = fs.existsSync(opts._filename) ? opts._filename : opts.name;
        // debug('Real path to load: %s', realPath);

        const func = require(opts._filename);

        assert(
          typeof func === 'function',
          `middleware ${opts.name} must be an function, but it is ${func}`,
        );

        fn = func.apply(func, opts.args);
        // use the middleware.
        this.maius.use(fn);
      }
    });
  }

  /**
   * Get all middlewares opts model, includes users and miaus'.
   *
   * @returns
   *
   * @since 0.1.0
   */

  public getAllMiddlewareOpts(): MdwOptsModel[] {
    const middleware: Middleware[] = [];
    const userMdwOpts: MdwOptsModel[] = this.getMiddlewareConfig();

    /**
     * Combine users middleware and maius' internal middlware.
     */
    const combinedMdwOpts: MdwOptsModel[] = [
      ...this.filterBeRordered(this.selfBeforeMdw),
      ...this.mergeSelfOptsWithUserReorderedOpts(userMdwOpts),
      ...this.filterBeRordered(this.selfAfterMdw),
    ].filter(opts => opts);

    // debug('combinedMiddleware: %O', combinedMdwOpts);

    return combinedMdwOpts;
  }

  /**
   * Get the middleware proporty in users config.js
   *
   * @returns users middleware config
   */

  private getMiddlewareConfig(): MdwOptsModel[] {
    const middleware = this.userConfig.middleware || [];
    assert(Array.isArray(middleware), '[config] middleware property must be an array type.');

    const optsList = middleware.map((opts, index) => {
      const cfg = new MdwOptsModel();

      if ('string' === typeof opts) {
        cfg.name = opts;
      } else {
        assert(
          typeof opts.name === 'string',
          `[config] middleware[${index}].name need string type value`,
        );
        cfg.name = opts.name;
        cfg.args = opts.args;

        if (isFunction(opts.load)) {
          cfg.load = opts.load;
        }
      }

      const filename = path.join(this.getMiddlewareDir(), `${cfg.name}.js`);

      // const realPath = fs.existsSync(opts._filename) ? opts._filename : opts.name;

      cfg._filename = fs.existsSync(filename) ? filename : cfg.name;

      // Only could set one maius middleware, the others will be remove.
      // if (this.willBeReorderdNames.has(cfg.name)) {
      //   cfg = null; // remove this middleware
      // }

      if (cfg && this.isSelfMiddlewareByOpts(cfg)) {
        this.willBeReorderdNames.add(cfg.name);
      }

      return cfg;
    });

    return optsList.filter(opts => opts !== null);
  }

  /**
   * Filter out middleware that has been reordered.
   */

  private filterBeRordered(arr: MdwOptsModel[]): typeof arr {
    return arr.filter(opts => {
      return !this.willBeReorderdNames.has(opts.name);
    });
  }

  /**
   * Merge options for maius middleware configured by user in config.js
   * with options for maius internal.
   *
   * @param arr the return value of this.getMiddlewareConfig() method.
   * @returns a new options array
   */

  private mergeSelfOptsWithUserReorderedOpts(arr: MdwOptsModel[]): typeof arr {

    return arr.map(opts => {
      if (this.willBeReorderdNames.has(opts.name)) {
        return this.makeOneSelfMiddlewareOpts(opts.name, opts);
      }

      return opts;
    });
  }

  /**
   * Get the users middlware directory path.
   *
   * @returns users middleware directory path.
   */

  private getMiddlewareDir(): string {
    return path.join(this.userOptions.rootDir, 'middleware');
  }

  /**
   * To make a maius middleware opts (options).
   *
   * @param name a maius middleware's name
   * @param newOpts this opts will be merged with initial opts.
   * @returns a new middleware opts
   */

  private makeOneSelfMiddlewareOpts(name, newOpts?: MdwOptsModel): typeof newOpts {
    assert('string' === typeof name, 'arguments[0] must be a string type!');
    assert(this.isSelfPrefix(name), 'it is not a internal middleware');

    const mdw = this.requireSelfMiddlewareByName(name);
    const opts = mdw.getMiddlewareOpts(newOpts);
    return opts;
  }

  /**
   * Require the maius middleware class file, and new an instance.
   *
   * @name name maius middleware's name
   * @returns the instance about this maius middleware class.
   */

  private requireSelfMiddlewareByName(name: string): BaseMiddleware {
    const rst = /^maius:(.*)$/.exec(name);

    debug('requireSelfMiddleware regexp result: %o', rst);
    assert(rst && rst[1], 'name regexp match error!');

    const Mdw = require(path.resolve(__dirname, '../lib/middleware', rst[1])).default;

    assert(isClass(Mdw), `Mdw ${rst[1]} is not class`);

    const mdw: BaseMiddleware = new Mdw(this.maius);
    return mdw;
  }

  /**
   * Is it maius' middlware? whatever it from users or maius.
   *
   * @param opts
   * @returns
   */

  private isSelfMiddlewareByOpts(opts: MdwOptsModel): boolean {
    return this.isSelfPrefix(opts.name);
  }

  private isSelfPrefix(name: string) {
    return /^maius:/.test(name);
  }
}
