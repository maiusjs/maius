import * as assert from 'assert';
import * as Debug from 'debug';
import * as KoaApplication from 'koa';
import * as log4js from 'log4js';
import { ListenOptions } from 'net';
import * as path from 'path';
import IUserConfig from './interface/i-user-config';
import IUserOptions from './interface/i-user-options';
import BaseContext from './lib/base-context';
import { httpClient, HttpClient } from './lib/httpclient';
import Logger from './lib/logger';
import Router from './lib/router';
import ControllerLoader from './loader/controller';
import MiddlewareLoader from './loader/middleware';
import ServiceLoader from './loader/service';
import UserConfigLoader from './loader/user-config';

type Middleware = KoaApplication.Middleware;

const debug = Debug('maius:maius');

const MIDDLEWARE_LOADER = Symbol('middleware_loader');
const CONTROLLER_LOADER = Symbol('controller_loader');
const SERVICE_LOADER = Symbol('service_loader');

class Maius extends KoaApplication {
  public static Controller = BaseContext;
  public static Service = BaseContext;
  public static Logger = Logger;

  public options: IUserOptions;
  public config: IUserConfig;
  // public app: Application;
  public router: Router;
  public controller: { [x: string]: BaseContext };
  public service: { [x: string]: BaseContext };
  public logger: log4js.Logger;
  public httpClient: HttpClient;
  // private middleware: Middleware[];

  /**
   * @constructor
   * @param options options
   * @param [options.rootDir] the directory of user application
   * @param [options.port] the port of user appliction will run at
   */

  constructor(options: IUserOptions) {
    super();

    this.errorHandler();

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
     * UserConfigLoader is a single instance class. And the instance will be
     * created here.
     *
     * @since 0.1.0
     */
    this.config = UserConfigLoader.create(this.options).config;

    this.logger = Logger.create({
      directory:
        this.config.logger.directory ||
        path.resolve(this.options.rootDir + './logs'),
      level:
        this.config.logger.level ||
        (this.config.env === 'dev' ? 'DEBUG' : 'ERROR'),
    }).getlogger();

    /**
     * Koa appliction instance
     *
     * @since 0.1.0
     */
    this.env = this.config.env;

    /**
     * maius router
     *
     * @since 0.1.0
     */
    this.router = new Router();

    /**
     * Convenient to initiate http request on node server.
     * It provides a lot of convenient methods for requesting.
     *
     * e.g.
     *    httpClient.get('xx').then(res => console.log(res));
     *    httpClient.post('xx').then(res => console.log(res));
     *
     * @since 0.1.0
     */
    this.httpClient = httpClient;

    /**
     * controller instances collection
     *
     * @since 0.1.0
     */
    this.controller = this.controllerLoader.getIntancesCol();

    debug('this.controller %o', this.controller);

    /**
     * service instances collection
     *
     * @since 0.1.0
     */
    this.service = this.serviceLoader.getIntancesCol();

    debug('this.service %o', this.service);

    /**
     * Init something
     */
    this.loadUserRoutes();
    this.useMiddleware();
  }

  /* tslint:disable:unified-signatures */

  /**
   * Run appcation at port
   *
   * promiseify this.listen
   *
   * @param port run app at the port
   * @returns listen done
   *
   * @since 0.1.0
   *
   * Cannot override the return value of koaApplication.listen in typescipt.
   * If we found a way to override return value in future, we'd better go to
   * override koaApplication.listen method.
   */

  public run(): Promise<void>;
  public run(
    port?: number,
    hostname?: string,
    backlog?: number,
    listeningListener?: () => void,
  ): Promise<void>;
  public run(
    port: number,
    hostname?: string,
    listeningListener?: () => void,
  ): Promise<void>;
  public run(
    port: number,
    backlog?: number,
    listeningListener?: () => void,
  ): Promise<void>;
  public run(port: number, listeningListener?: () => void): Promise<void>;
  public run(
    path: string,
    backlog?: number,
    listeningListener?: () => void,
  ): Promise<void>;
  public run(path: string, listeningListener?: () => void): Promise<void>;
  public run(options: ListenOptions, listeningListener?: () => void): Promise<void>;
  public run(
    handle: any,
    backlog?: number,
    listeningListener?: () => void,
  ): Promise<void>;
  public run(handle: any, listeningListener?: () => void): Promise<void>;
  public run(...args): Promise<void> {

    return new Promise((resolve, reject) => {
      if (args.length === 0) {
        args[0] = this.options.port || 3123;
        if (args[0] === 3123) {
          this.logger.info('The application is running at default port: 3123');
        }
      }

      const cb: any = e => {
        if (e) {
          reject(e);
          return;
        }
        resolve();
      };

      this.listen(...args, cb);
    });
  }

  // public listen(...args): any {
  //   let fn = null;
  //   if (typeof args[args.length - 1] === 'function') {
  //     fn = args.pop();
  //   }

  //   // this.callback is in the KoaApplication.
  //   const server = createServer(this.callback());

  //   server.listen();

  //   return new Promise((resolve, reject) => {
  //     server.listen(...args, e => {
  //       if (e) {
  //         reject(e);
  //         return;
  //       }
  //       resolve();
  //     });
  //   });
  // }

  /**
   * controller loader, and the loader is a single instance.
   *
   * @private
   */

  private get controllerLoader(): ControllerLoader {
    if (this[CONTROLLER_LOADER]) {
      return this[CONTROLLER_LOADER];
    }

    this[CONTROLLER_LOADER] = new ControllerLoader(this, {
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

    this[SERVICE_LOADER] = new ServiceLoader(this, {
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

    this[MIDDLEWARE_LOADER] = new MiddlewareLoader(this);
    return this[MIDDLEWARE_LOADER];
  }

  /**
   * Load all middleware, includes users and maius internal middleware.
   *
   * @private
   */

  private useMiddleware(): void {
    this.middlewareLoader.useAllMiddleware();
  }

  /**
   * @private
   */

  private loadUserRoutes(): void {
    const router = require(path.join(this.options.rootDir, 'router.js'));
    assert('function' === typeof router, 'router.js must be a function type!');
    router({
      controller: this.controller,
      router: this.router,
    });
  }

  /**
   * @private
   */

  private errorHandler() {
    this.on('error', e => {
      this.logger.error(e);
    });
  }
}

export default Maius;
module.exports = Maius;
module.exports.default = Maius;
