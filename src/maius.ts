import * as accepts from 'accepts';
import * as assert from 'assert';
import * as Cookies from 'cookies';
import * as Debug from 'debug';
import * as fs from 'fs';
import * as http from 'http';
import * as KoaApplication from 'koa';
import * as log4js from 'log4js';
import * as path from 'path';
import BaseContext from './core/lib/base-context';
import { HttpClient } from './core/lib/httpclient';
import Logger from './core/lib/logger';
import Router from './core/lib/router';
import configLoader, { IConfig } from './core/loader/config';
import ControllerLoader from './core/loader/controller';
import MiddlewareLoader, { IMiddlewareConfig } from './core/loader/middleware';
import PluginLoader from './core/loader/plugin/plugin';
import ServiceLoader from './core/loader/service';
import { isFunction } from './core/utils/type';
import { IStaticConfig } from './plugin/maius-static/plugin';

export type MaiusContext = KoaApplication.Context;

export interface IOptions {
  rootDir: string;
  port?: number;
}

const debug = Debug('maius:maius');
const CONTROLLER_LOADER = Symbol('controller_loader');
const SERVICE_LOADER = Symbol('service_loader');

const dirname = {
  CONFIG: 'config',
  CONTROLLER: 'src/controller',
  MIDDLEWARE: 'src/middleware',
  PLUGIN: 'src/plugin',
  ROUTER: 'src/router.js',
  SERVICE: 'src/service',
  STATIC: 'public',
  VIEW: 'view',
};

class Maius extends KoaApplication {
  public static Controller = BaseContext;
  public static Service = BaseContext;
  public static Logger = Logger;

  /**
   * @since 0.1.0
   */
  public version: string;

  /**
   * user options
   * @since 0.1.0
   */
  public options: IOptions;

  /**
   * UserConfigLoader is a single instance class. And the instance will be
   * created here.
   * @since 0.1.0
   */
  public config: IConfig;

  /**
   * @since 0.1.0
   */
  public router: Router;

  /**
   * @since 0.1.0
   */
  public dirname: typeof dirname;

  /**
   * controller instances collection
   * @since 0.1.0
   */
  public controller: { [x: string]: BaseContext };

  /**
   * service instances collection
   * @since 0.1.0
   */
  public service: { [x: string]: BaseContext };

  /**
   * @since 0.1.0
   */
  public logger: log4js.Logger;

  /**
   * @since 0.1.0
   */
  public httpClient: HttpClient;

  /**
   * @since 0.1.0
   */
  public ctx: KoaApplication.Context;

  /**
   * @constructor
   * @param options options
   * @param [options.rootDir] the directory of user application
   * @param [options.port] the port of user appliction will run at
   */
  constructor(options: IOptions) {
    super();

    this.errorHandler();

    assert(
      typeof options.rootDir === 'string',
      'options.rootDir config error!',
    );

    this.version = this.getPackageJSON().version;

    this.dirname = dirname;

    this.options = options;

    this.config = new configLoader(path.join(this.options.rootDir, dirname.CONFIG)).getConfig();

    debug('maius config: %o', this.config);

    this.logger = this.getLogger();

    this.env = this.config.env;

    // pluin loader
    const pluginLoader = new PluginLoader(this);

    // load internal plugin
    pluginLoader.loadPlugin([

      /**
       * @since 0.1.0
       */
      { name: 'maius-logger' },

      /**
       * @since 0.1.0
       */
      { name: 'maius-view' },

      /**
       * @since 0.1.0
       */
      this.pluginStatic(),
    ]);

    this.useInternalMiddleware();

    // load external plugin
    pluginLoader.loadExternalPlugin();

    // load user middleware
    this.useMiddleware();

    // router middleware have to be used after other middleware.
    pluginLoader.loadPlugin([
      /**
       * this.router
       * @since 0.1.0
       */
      { name: 'maius-router' },
    ]);

    this.controller = this.controllerLoader.getIntancesCol();

    debug('this.controller %o', this.controller);

    this.service = this.serviceLoader.getIntancesCol();

    debug('this.service %o', this.service);

    this.loadUserRoutes();
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
   * get package.json
   */
  private getPackageJSON() {
    const PATH = path.resolve(__dirname, '../package.json');
    return require(PATH);
  }

  /**
   * get a logger
   */
  private getLogger(): log4js.Logger {
    const opts = this.config.logger
      ? this.config.logger
      : {
        directory: path.join(this.options.rootDir, 'logs'),
        level: 'DEBUG',
      };

    return Logger.create(opts, this.options).getlogger();
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
      path: path.join(this.options.rootDir, dirname.CONTROLLER),
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
      path: path.join(this.options.rootDir, dirname.SERVICE),
    });
    return this[SERVICE_LOADER];
  }

  /**
   * get maius-static plugin options
   */
  private pluginStatic(): IStaticConfig {
    const config = this.config.static;
    const options: IStaticConfig['options'] = Array.isArray(config)
      ? config
      : [path.join(this.options.rootDir, dirname.STATIC)]; // default

    return {
      options,
      name: 'maius-static',
    };
  }

  /**
   * use all maius internal middleware
   */
  private useInternalMiddleware(): void {
    const dir = path.resolve(__dirname, 'middleware');
    if (!fs.existsSync(dir)) {
      return;
    }

    const mdwConfigs: IMiddlewareConfig[] = [];
    const list = fs.readdirSync(dir);

    for (let i = 0; i < list.length; i += 1) {
      const filename = list[i];
      // then filenme must end with .js
      if (!/\.js$/.test(filename)) continue;

      const content = require(path.join(dir, filename));

      if (isFunction(content)) {
        mdwConfigs.push({ handle: content });
      }
    }

    new MiddlewareLoader(
      this,
      dir,
      mdwConfigs,
    ).load();
  }

  /**
   * Load all middleware, includes users and maius internal middleware.
   *
   * @private
   */
  private useMiddleware(): void {
    const dir = path.join(this.options.rootDir, dirname.MIDDLEWARE);
    const middlewareLoader = new MiddlewareLoader(
      this,
      dir,
      this.config.middleware as IMiddlewareConfig[],
    );
    middlewareLoader.load();
  }

  /**
   * @private
   */
  private loadUserRoutes(): void {
    const filename = path.join(this.options.rootDir, dirname.ROUTER);
    if (!fs.existsSync(filename)) {
      debug(`Not found routes ${filename}`);
      return;
    }

    const router = require(filename);
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
