import * as accepts from 'accepts';
import * as assert from 'assert';
import * as Cookies from 'cookies';
import * as Debug from 'debug';
import * as http from 'http';
import * as KoaApplication from 'koa';
import * as log4js from 'log4js';
import * as path from 'path';
import IUserConfig from './core/interface/i-user-config';
import IUserOptions from './core/interface/i-user-options';
import BaseContext from './core/lib/base-context';
import { httpClient, HttpClient } from './core/lib/httpclient';
import Logger from './core/lib/logger';
import Router from './core/lib/router';
import ControllerLoader from './core/loader/controller';
import MiddlewareLoader, { IMiddlewareConfig } from './core/loader/middleware';
import PluginLoader from './core/loader/plugin/plugin';
import ServiceLoader from './core/loader/service';
import UserConfigLoader from './core/loader/user-config';

type Middleware = KoaApplication.Middleware;

export type MaiusContext = KoaApplication.Context;

const debug = Debug('maius:maius');

const CONTROLLER_LOADER = Symbol('controller_loader');
const SERVICE_LOADER = Symbol('service_loader');

class Maius extends KoaApplication {
  public static Controller = BaseContext;
  public static Service = BaseContext;
  public static Logger = Logger;

  public options: IUserOptions;
  public config: IUserConfig;
  public router: Router;
  public controller: { [x: string]: BaseContext };
  public service: { [x: string]: BaseContext };
  public logger: log4js.Logger;
  public httpClient: HttpClient;
  public ctx: KoaApplication.Context;

  /**
   * extends from plugin
   */

  public routeer: any;

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

    this.logger = Logger.create(this.config.logger, this.options).getlogger();

    /**
     * Koa appliction instance
     *
     * @since 0.1.0
     */
    this.env = this.config.env;

    /**
     * Load plugin
     */

    const pluginLoader = new PluginLoader(this);

    // load internal plugin
    pluginLoader.loadPlugin([
      { name: 'maius-router' },
      { name: 'maius-demo' },
    ]);
    // pluginLoader.loadInteralPlugin();

    pluginLoader.loadExternalPlugin();

    /**
     * maius router
     *
     * @since 0.1.0
     */
    // this.router = new Router();

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

  /**
   * promisify listen method
   */

  public listen(...args): any {
    return new Promise((resolve, reject) => {
      if (args.length === 0) {
        args[0] = this.options.port || 3123;
        if (args[0] === 3123) {
          this.logger.info(
            'The application will running at default port: 3123',
          );
        }
      }

      const server = http.createServer(this.callback());
      server.listen(...args, e => {
        if (e) {
          reject(e);
          return;
        }
        resolve();
      });
    });
  }

  /**
   * override koa createContext method get context
   * @param req IncomingMessage
   * @param res ServerResponse
   */

  public createContext(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): KoaApplication.Context {
    const context = Object.create(this.context);
    this.ctx = context;
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.cookies = new Cookies(req, res, {
      keys: this.keys,
      secure: request.secure,
    });
    request.ip = request.ips[0] || req.socket.remoteAddress || '';
    context.accept = request.accept = accepts(req);
    context.state = {};
    return context;
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
   * Load all middleware, includes users and maius internal middleware.
   *
   * @private
   */

  private useMiddleware(): void {
    const dirname = path.join(this.options.rootDir, 'middleware');
    const middlewareLoader = new MiddlewareLoader(
      this,
      dirname,
      this.config.middleware as IMiddlewareConfig[],
    );

    middlewareLoader.load();
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
