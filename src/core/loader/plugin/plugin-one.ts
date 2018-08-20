import * as Debug from 'debug';
import * as fs from 'fs';
import { Middleware } from 'koa';
import * as path from 'path';
import Maius from '../../../maius';
import callClassOrFn from '../../utils/call-class-or-fn';
import ConfigLoader, { IConfig } from '../config';
import MiddlewareLoader from '../middleware';

const debug = Debug('maius:PluginOneLoader');

export interface IPlugin {
  middleware?: ((...args: any[]) => Middleware)[];
}

/**
 * plugin config
 */
export interface IPluginConfig {
  name: string;
  [x: string]: any;
}

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
  public targetConfig: IPluginConfig;

  /**
   * the config in the plugin/config
   * @since 0.1.0
   */
  public config: IConfig;

  private app: Maius;

  /**
   * Load one plugin
   *
   * @param app the maius instance.
   * @param dirname the target plugin directory.
   * @param targetConfig target plugin config.
   */
  constructor(app: Maius, dirname: string, targetConfig: IPluginConfig) {
    this.app = app;
    this.dirname = dirname;
    this.targetConfig = targetConfig;

    this.directory = {
      config: path.join(this.dirname, 'config'),
      middleware: path.join(this.dirname, 'middleware'),
    };

    // load config in plugin/config/
    if (fs.existsSync(path.join(this.directory.config))) {
      this.config = new ConfigLoader(this.directory.config).getConfig();
    } else {
      this.config = {};
    }
  }

  /**
   * Load plugin
   */
  public load(): void {
    debug('load plugin - %s', this.targetConfig.name);

    // call the entry file
    this.callEntry();

    // use the middlware
    if (
      fs.existsSync(path.join(this.directory.middleware))
      && Array.isArray(this.config.middleware)
    ) {
      new MiddlewareLoader(
        this.app,
        path.join(this.dirname, 'middleware'),
        this.config.middleware,
      ).load(this.targetConfig);
    }
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
      // console.log('no plugin entry')
      return;
    }

    try {
      const content = require(pluginPath);
      callClassOrFn(content, [this.app, this.targetConfig]);
    } catch (error) {
      console.error(error);
      throw new Error(`The plugin.(js|ts) is not a class or function in ${pluginPath}`);
    }
  }
}
