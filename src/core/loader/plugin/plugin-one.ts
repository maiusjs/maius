import * as Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import Maius from '../../../maius';
import callClassOrFn from '../../utils/callClassOrFn';
import MiddlewareLoader from '../middleware';
import PluginConfigLoader from './plugin-config';

const debug = Debug('maius:PluginOneLoader');

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
  public pluginConfig: any;

  /**
   * The middleware list that legal and not disabled.
   * @since 0.1.0
   */
  // public middlewareConfig: IMiddlewareConfig[];

  private app: Maius;
  private config: any;
  // private middlewareLoader: PluginMiddlewareLoader;

  /**
   * Load one plugin
   *
   * @param dirname the target plugin directory.
   * @param config target plugin config.
   * @param app the maius instance.
   */
  constructor(app: Maius, dirname: string, pluginConfig: IPluginConfig) {
    this.app = app;
    this.dirname = dirname;
    this.pluginConfig = pluginConfig;

    this.directory = {
      config: path.join(this.dirname, 'config'),
      middleware: path.join(this.dirname, 'middleware'),
    };

    // load config in plugin/config/
    if (fs.existsSync(path.join(this.directory.config))) {
      this.config = new PluginConfigLoader(this.directory.config).config;
    } else {
      this.config = {};
    }

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
      ).load(pluginConfig);
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
      callClassOrFn(pluginPath, [this.app, this.pluginConfig]);
    } catch (error) {
      throw new Error(`The plugin.(js|ts) is not a class or function in ${pluginPath}`);
    }
  }
}
