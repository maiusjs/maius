import * as assert from 'assert';
import * as Debug from 'debug';
import * as fs from 'fs';
import { Middleware } from 'koa';
import * as path from 'path';
import IUserConfig, { IUserConfigMiddlewareArrItem } from '../interface/i-user-config';
import IUserOptions from '../interface/i-user-options';
import { maiusViews } from '../lib/middleware/maius-views';
import maiusStatic from '../lib/middleware/static';
import Maius from '../maius';
import { isObject } from '../utils/index';

const debug = Debug('maius:middlewareLoader');
const MIDDLEWARE = Symbol('middleware');

/**
 * It not only load users middleware, but also load maius' internal middleware.
 */

export default class MiddlewareLoader {
  private maius: Maius;
  private options: IUserOptions;
  private userConfig: IUserConfig;
  private selfBeforeMdw: IUserConfigMiddlewareArrItem[];
  private selfAfterMdw: IUserConfigMiddlewareArrItem[];

  /**
   * @constructor
   * @param options users options
   * @param userConfig users config.js
   */

  constructor(maius: Maius) {
    /**
     * @private
     */
    this.options = maius.options;
    assert(this.options.rootDir);

    /**
     * @private
     */
    this.userConfig = maius.userConfig;

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
      this.selfStaticMiddleware(),
      this.viewMiddleware(),
    ];

    /**
     * Same as above.
     *
     * @private
     */
    this.selfAfterMdw = [
      this.selfRouterMiddleware(),
    ];
  }

  /**
   * Get all middlewares, includes users and miaus'.
   *
   * @returns
   *
   * @since 0.1.0
   */

  public getMiddleware(): Middleware[] {
    if (this[MIDDLEWARE]) return this[MIDDLEWARE];

    const middleware: Middleware[] = [];
    const userMdwOpts: IUserConfigMiddlewareArrItem[] = this.getMiddlewareConfig();

    /**
     * Combine users middleware and maius' internal middlware.
     */
    const combinedMdwOpts: IUserConfigMiddlewareArrItem[] = [
      ...this.selfBeforeMdw,
      ...userMdwOpts,
      ...this.selfAfterMdw,
    ];

    debug('combinedMiddleware: %O', combinedMdwOpts);

    const reorderedMdwOpts = this.reorderMiddlewareOpts(combinedMdwOpts);

    debug('reorderedMiddelware: %O', reorderedMdwOpts);

    reorderedMdwOpts.forEach((opts, index) => {
      const mdw: Middleware = this.loadOneMiddleware(opts);
      middleware.push(mdw);
    });

    this[MIDDLEWARE] = middleware;
    return this[MIDDLEWARE];
  }

  /**
   * Get the middleware proporty in users config.js
   *
   * @returns users middleware config
   */

  private getMiddlewareConfig(): IUserConfigMiddlewareArrItem[] {
    const middleware = this.userConfig.middleware || [];
    assert(Array.isArray(middleware), '[config] middleware property must be an array type.');

    return middleware.map((opts, index) => {
      const cfg: IUserConfigMiddlewareArrItem = {
        _couldReorder: null,
        _filename: null,
        args: [],
        name: null,
      };

      if ('string' === typeof opts) {
        cfg.name = opts;
      } else {
        assert(
          typeof opts.name === 'string',
          `[config] middleware[${index}].name need string type value`,
        );
        cfg.name = opts.name;
        cfg.args = opts.args;
      }

      cfg._filename = path.join(this.getMiddlewareDir(), `${cfg.name}.js`);

      return cfg;
    });
  }

  /**
   * Get the users middlware directory path.
   *
   * @returns users middleware directory path.
   */

  private getMiddlewareDir(): string {
    return path.join(this.options.rootDir, 'middleware');
  }

  /**
   * To load one middleware.
   *
   * @param opts
   * @returns The middleware function.
   */

  private loadOneMiddleware(opts: IUserConfigMiddlewareArrItem): Middleware {
    debug('Load one middleware: %o', opts);

    let fn: Middleware = null;

    if ('function' === typeof opts.load) {
      fn = opts.load(this.maius.app);
    } else {
      const func = fs.statSync(opts._filename) ?
        require(opts._filename) :
        require(opts.name);
      assert(
        typeof func === 'function',
        `middleware ${opts.name} must be an function, but it is ${func}`,
      );
      fn = func.apply(func, opts.args);
    }

    return fn;
  }

  /**
   * It could be reordered the middleware include users and maius's,
   * if user setting it.
   *
   * @param arr
   * @returns Filtered middlewareOpts.
   */

  private reorderMiddlewareOpts(arr: IUserConfigMiddlewareArrItem[]): typeof arr {
    const reorderedNames = new Set<string>();
    const removed = [];

    // find the names of that be reordered internal middleware.
    arr.forEach(opts => {
      if (opts._couldReorder) return;

      if (this.isSelfMiddleware(opts)) {
        reorderedNames.add(opts.name);
      }
    });

    // filter the internal middleware that be ordered.
    const filted = arr.filter(opt => {
      // _couldReorder is true means that the middleware is an internal middleware and
      // it could be reorder.
      if (opt._couldReorder && reorderedNames.has(opt.name)) {
        removed.push(opt);
        return false;
      }
      return true;
    });

    return filted.map(opt => {
      if (!this.isSelfMiddleware(opt)) return opt;

      // find the middleware that be removed away.
      const removedMdw = this.findSelfMiddlewareOpt(removed, opt.name, true);
      if (!removedMdw) {
        return opt;
      }

      // assign user opt and internal opt.
      return this.assignOpt(removedMdw, opt);
    });
  }

  /**
   * find the middleware by the conditions.
   *
   * @param arr source array.
   * @param name the name of middleware.
   * @param reorder the value of opt._couldReorder.
   * @returns
   */

  private findSelfMiddlewareOpt(
    arr: IUserConfigMiddlewareArrItem[],
    name: string,
    reorder: boolean,
  ): IUserConfigMiddlewareArrItem {
    let cfg: IUserConfigMiddlewareArrItem = null;

    arr.forEach(opt => {
      if (name === opt.name && !!reorder === opt._couldReorder) {
        cfg = opt;
      }
    });

    return cfg;
  }

  private assignOpt(opt1: IUserConfigMiddlewareArrItem, opt2: typeof opt1) {
    const cfg: IUserConfigMiddlewareArrItem = {
      _couldReorder: null,
      _filename: null,
      args: null,
      load: null,
      name: null,
    };

    return Object.assign(cfg, opt1, opt2);
  }

  /**
   * Is it maius' middlware? whatever it from users or maius.
   *
   * @param opts
   * @returns
   */

  private isSelfMiddleware(opts: IUserConfigMiddlewareArrItem): boolean {
    return /^maius:/.test(opts.name);
  }

  /**
   * Generate maius-static middleware options.
   *
   * @returns maius-static middleware options.
   */

  private selfStaticMiddleware(): IUserConfigMiddlewareArrItem {
    const publicPath = path.join(this.options.rootDir, 'public');

    try {
      fs.readdirSync(publicPath);
    } catch (e) {
      return;
    }

    return {
      _couldReorder: true,
      load: () => {
        return maiusStatic(publicPath, this.userConfig.static);
      },
      name: 'maius:static',
    };
  }

  /**
   * Generate maius-router middleware config
   *
   * @returns
   */

  private selfRouterMiddleware(): IUserConfigMiddlewareArrItem {
    return {
      _couldReorder: true,
      load: () => {
        return this.maius.router.routes();
      },
      name: 'maius:router',
    };
  }

  /**
   * Get view middlewares, includes users and maius
   *
   * @returns
   *
   * @since 0.1.0
   */
  private viewMiddleware(): IUserConfigMiddlewareArrItem {

    const carryList: Map<string, any> = new Map();
    const DEF_ENGINE = 'ejs';
    carryList.set('ejs', {
      engine: 'ejs',
      extension: 'ejs',
      viewsDir: 'views',
    });
    carryList.set('nunjucks', {
      engine: 'nunjucks',
      extension: 'html',
      viewsDir: 'views',
    });
    return {
      _couldReorder: false,
      load: () => {
        const options = this.maius.options;
        const userConfig = this.maius.userConfig;
        let viewDir = null;
        if (isObject(userConfig.viewEngine)) {
          viewDir = userConfig.viewEngine.viewsDir;
        }
        if (viewDir == null) {
          global.console.warn('you do not have a configuration view folder,\
            which uses the views folder by default');
          viewDir = 'views';
        }
        const rootDir = path.join(options.rootDir, viewDir);
        let engineConfig = null;
        if (carryList.has(userConfig.viewEngine.engine)) {
          const def = carryList.get(userConfig.viewEngine.engine);
          engineConfig = Object.assign(def, userConfig.viewEngine);
        } else {
          viewDir = 'views';
          const def = carryList.get(DEF_ENGINE);
          engineConfig = Object.assign(userConfig.viewEngine, def);
          global.console.warn('the framework does not find the view engine you want to use,\
           use ejs view engine by default');
        }
        debug('engineConfig %o', engineConfig);
        return maiusViews(rootDir, {
          extension: engineConfig.extension,
          map: {
            [engineConfig.extension]: engineConfig.engine,
          },
        });
      },
      name: 'koa-view',
    };
  }
}
