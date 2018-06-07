import * as assert from 'assert';
import * as Debug from 'debug';
import * as fs from 'fs';
import { Middleware } from 'koa';
import * as path from 'path';
import IUserOptions from './interface/i-user-options';
import Application from './lib/application';
import BaseContext from './lib/base-context';
import Router from './lib/router';
import maiusStatic from './lib/static';
import ControllerLoader from './loader/controller';
import MiddlewareLoader from './loader/middleware';
import ServiceLoader from './loader/service';
import UserConfigLoader from './loader/user-config';

const debug = Debug('maius:maius');

const MIDDLEWARE_LOADER = Symbol('middleware_loader');
const CONTROLLER_LOADER = Symbol('controller_loader');
const SERVICE_LOADER = Symbol('service_loader');
const USER_CONFIG = Symbol('user_config');

class Maius {
  public static Controller = BaseContext;
  public static Service = BaseContext;

  public options: IUserOptions;
  public app: Application;
  public router: Router;
  public controller: { [x: string]: BaseContext };
  public service: { [x: string]: BaseContext };

  /**
   * @constructor
   * @param options options
   * @param [options.rootDir] the directory of user application
   * @param [options.port] the port of user appliction will run at
   */

  constructor(options: IUserOptions) {
    assert(
      typeof options.rootDir === 'string',
      'options.rootDir config error!',
    );

    /**
     * user options
     *
     * @since 0.1.0
     */
    this.options = options;

    /**
     * Koa appliction instance
     *
     * @since 0.1.0
     */
    this.app = new Application();

    /**
     * maius router
     *
     * @since 0.1.0
     */
    this.router = new Router({});

    /**
     * controller instances collection
     *
     * @since 0.1.0
     */
    this.controller = this.controllerLoader.getIntancesCol();

    debug('%o %o', 'this.controller', this.controller);

    /**
     * service instances collection
     *
     * @since 0.1.0
     */
    this.service = this.serviceLoader.getIntancesCol();

    debug('%o %o', 'this.service', this.service);

    this.setControllerAndServiceProps();

    this.useMiddleware();

    debug(
      '%o %o %o',
      'middleware',
      this.middleware,
      this.afterRouterMiddleware,
    );

    this.useStatic();
    this.useRouter();
    this.useAfterRouterMiddleware();
  }

  /**
   * Run appcation at port
   *
   * @param port run app at the port
   * @returns listen done
   *
   * @since 0.1.0
   */

  public listen(port): Promise<void> {
    assert(
      typeof port === 'number',
      'Maius.prototype.listen(port), port must be a number',
    );

    return new Promise(resolve => {
      this.app.listen(port, () => resolve());
    });
  }

  /**
   * controller loader, and the loader is a single instance.
   *
   * @private
   */

  private get controllerLoader(): ControllerLoader {
    if (this[CONTROLLER_LOADER]) {
      return this[CONTROLLER_LOADER];
    }

    this[CONTROLLER_LOADER] = new ControllerLoader({
      path: path.join(this.options.rootDir, 'controller'),
    });
    return this[CONTROLLER_LOADER];
  }

  /**
   * service loader, and the loader is a single instance.
   *
   * @private
   */

  private get serviceLoader(): ServiceLoader {
    if (this[SERVICE_LOADER]) {
      return this[SERVICE_LOADER];
    }

    this[SERVICE_LOADER] = new ServiceLoader({
      path: path.join(this.options.rootDir, 'service'),
    });
    return this[SERVICE_LOADER];
  }

  /**
   * MiddlewareLoader instance
   *
   * @private
   */

  private get middlewareLoader(): MiddlewareLoader {
    if (this[MIDDLEWARE_LOADER]) {
      return this[MIDDLEWARE_LOADER];
    }

    this[MIDDLEWARE_LOADER] = new MiddlewareLoader(this.options);
    return this[MIDDLEWARE_LOADER];
  }

  /**
   * Controller and Service instances will bind controller and service
   * in their context.
   *
   * @private
   */

  private setControllerAndServiceProps(): void {
    Object.keys(this.controller).forEach(key => {
      this.controller[key].bindController(this.controller);
      this.controller[key].bindService(this.service);
    });
    Object.keys(this.service).forEach(key => {
      this.service[key].bindController(this.controller);
      this.service[key].bindService(this.service);
    });
  }

  /**
   * Load user's middleware that the property 'afterRouter' is false.
   * The property
   *
   * @private
   */

  private useMiddleware(): void {
    this.middleware.forEach(fn => {
      this.app.use(fn);
    });
  }

  /**
   * Load user's middleware that the property 'afterRouter' is true.
   *
   * @private
   */

  private useAfterRouterMiddleware(): void {
    this.afterRouterMiddleware.forEach(fn => {
      this.app.use(fn);
    });
  }

  /**
   * @private
   * @since 0.1.0
   */

  private useStatic(): void {
    const publicPath = path.join(this.options.rootDir, 'public');

    try {
      fs.readdirSync(publicPath);
    } catch (e) {
      return;
    }

    this.app.use(maiusStatic(publicPath, this.userConfig.static));
  }

  /**
   * @private
   * @since 0.1.0
   */

  private useRouter(): void {
    require(path.join(this.options.rootDir, 'router.js'))({
      controller: this.controller,
      router: this.router,
    });
    this.app.use(this.router.routes());
  }

  /**
   * the middlewares without afterRouterMiddleware.
   *
   * @since 0.1.0
   */

  get middleware(): Middleware[] {
    return this.middlewareLoader.getMiddlewera().middleware;
  }

  /**
   * the afterRouterMiddlewares
   *
   * @since 0.1.0
   */

  get afterRouterMiddleware(): Middleware[] {
    return this.middlewareLoader.getMiddlewera().afterRouterMiddleware;
  }

  /**
   * user config
   *
   * @since 0.1.0
   */

  get userConfig() {
    if (this[USER_CONFIG]) {
      return this[USER_CONFIG];
    }

    this[USER_CONFIG] = new UserConfigLoader(this.options).config;
    return this[USER_CONFIG];
  }
}

module.exports = Maius;
