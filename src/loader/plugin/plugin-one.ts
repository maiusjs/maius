import * as fs from 'fs';
import { Middleware } from 'koa';
import * as path from 'path';
import Maius from '../../maius';
import { IMiddleware } from '../../plugin/router/lib/router';
import callClassOrFn from '../../utils/callClassOrFn';
import { isFunction } from '../../utils/type';
import PluginConfigLoader from './plugin-config';
import PluginMiddlewareLoader from './plugin-middleware';
import PluginMiddlewareConfigLoader, { IMiddlewareConfig } from './plugin-middlweare-config';

export default class PluginOneLoader {

  /**
   * the plugin root directory
   * @since 0.1.0
   */
  public dirname: string;

  /**
   * the plugin sub directory path.
   * @since 0.1.0
   */
  public directory: {
    config: string;
    middleware: string;
  };

  /**
   * Plugin config collection.
   * @since 0.1.0
   */
  public config: any;

  /**
   * The middleware list that legal and not disabled.
   * @since 0.1.0
   */
  public middlewareConfigList: IMiddlewareConfig[];

  private app: Maius;
  private pluginConfigLoader: PluginConfigLoader;
  private pluginMiddlewareLoader: PluginMiddlewareLoader;
  private pluginMiddlewareConfigLoader: PluginMiddlewareConfigLoader;

  /**
   * Load one plugin
   *
   * @param dirname the target plugin directory.
   * @param app the maius instance.
   */
  constructor(dirname: string, app: Maius) {
    this.app = app;
    this.dirname = dirname;

    this.directory = {
      config: path.join(this.dirname, 'config'),
      middleware: path.join(this.dirname, 'middleware'),
    };

    // load plugin config
    if (fs.existsSync(path.join(this.directory.config))) {
      this.pluginConfigLoader = new PluginConfigLoader(this.directory.config);
      this.config = this.pluginConfigLoader.config;
    } else {
      this.config = {};
    }

    if (fs.existsSync(path.join(this.directory.middleware))) {
      // middleware function loader
      this.pluginMiddlewareLoader = new PluginMiddlewareLoader(this.directory.middleware);
    }

    if (Array.isArray(this.config.middleware)) {
      // middleware config loader
      this.pluginMiddlewareConfigLoader =
        new PluginMiddlewareConfigLoader(this.config.middleware as IMiddleware[]);

      // filtered middleware config list
      this.middlewareConfigList = this.pluginMiddlewareConfigLoader.middlewareConfigList;
    }

    // call the entry file
    this.callEntry();

    // use the middlware
    this.useMiddleware();
  }

  /**
   * Load the plugin.(t|j)s in the target plugin directory.
   */
  private callEntry(): void {
    let pluginPath = null;

    if (fs.existsSync(path.join(this.dirname, 'plugin.ts'))) {
      pluginPath = path.join(this.dirname, 'plugin.ts');
    } else if (fs.existsSync(path.join(this.dirname, 'plugin.js'))) {
      pluginPath = path.join(this.dirname, 'plugin.js');
    } else {
      console.log('no plugin entry');
      return;
    }

    try {
      callClassOrFn(pluginPath, [this.app]);
    } catch (error) {
      const content = require(pluginPath);
      console.error(content);
      throw new Error('The plugin.(js|ts) is not a class or function');
    }
  }

  /**
   * use all middleware.
   */
  private useMiddleware() {
    if (!this.pluginMiddlewareLoader) return;
    if (!this.middlewareConfigList) return;

    const middlewareCol = this.pluginMiddlewareLoader.middlewareCol;

    for (let i = 0; i < this.middlewareConfigList.length; i += 1) {
      const itemConfig: IMiddlewareConfig = this.middlewareConfigList[i];
      const name = itemConfig.name;
      let mdw: Middleware = null;

      // name as Middleware
      if (isFunction(name)) {
        mdw = name as Middleware;

      // name as string
      } else if ('string' === typeof name) {

        // not fount the middleware
        if (!middlewareCol[name]) {
          console.warn('Not fount the middlware', name);
          continue;
        }

        mdw = middlewareCol[name];
      } else {
        continue;
      }

      const args = itemConfig.args || [];
      // use the middlware
      this.app.use(mdw.apply(null, [...args, this.app]));
    }
  }
}
