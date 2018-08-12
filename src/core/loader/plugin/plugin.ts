import * as Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import Maius from '../../../maius';
import IUserConfig from '../../interface/i-user-config';
import PluginListLoader, { IPluginItem } from './plugin-list';

const debug = Debug('maius:PluginLoader');

export default class PluginLoader {
  private app: Maius;
  private lookArray: string[];

  /**
   * Create a plugin loader;
   *
   * @param app maius instance.
   */
  constructor(app) {
    this.app = app;

    const APP_PATH = this.app.options.rootDir;
    const APP_PROJECT_ROOT = this.lookupProjectRoot(APP_PATH);
    const MAIUS_INTERNAL_PLUGIN_PATH = path.resolve(__dirname, '../../../plugin');
    const MAIUS_PROJECT_ROOT = this.lookupProjectRoot(path.resolve(__dirname));

    // finding the plugin directory in the following order.
    this.lookArray = [
      path.join(APP_PATH, 'plugin'),
      path.join(APP_PROJECT_ROOT, 'node_modules'),
      path.join(MAIUS_INTERNAL_PLUGIN_PATH),
      path.join(MAIUS_PROJECT_ROOT, 'node_modules'),
    ];
  }

  /**
   * Load all internal plugin.
   *
   * @param dirname the internal plugin root directory.
   */
  public loadInteralPlugin(): void {
    // const configList = [
    //   { name: 'maius-router' },
    //   { name: 'maius-demo' },
    // ];

    // this.loadPlugin(configList);
  }

  public loadExternalPlugin(): void {
    const pluginConfigList = this.app.config.plugin;

    // debug('external plugin: %o', pluginConfigList);

    this.loadPlugin(pluginConfigList);
  }

  /**
   * Loading any plugin base on parameter.
   *
   * @param configList plugin config list.
   */
  public loadPlugin(configList: IUserConfig['plugin']): void {
    // Don't load any external plugin if don't have plugin config
    if (!configList
      || !Array.isArray(configList)
      || !configList.length
    ) return;

    debug('loading plugins: %o', configList);

    // the plugins will to load.
    const loadList: IPluginItem[] = [];

    // Finding the plugins that need to load.
    for (let i = 0; i < configList.length; i += 1) {
      const config = configList[i];
      const dirname = this.lookupPath(config.name);
      if (dirname) {
        loadList.push({ dirname, config });
      }
    }

    // To load.
    new PluginListLoader(this.app, loadList).load();
  }

  /**
   * Finding the target plugin directory.
   *
   * @param name the name of plugin
   * @return plugin directory
   */
  private lookupPath(name): string {
    for (let i = 0; i < this.lookArray.length; i += 1) {
      const lookPath = this.lookArray[i];

      if (fs.existsSync(path.join(lookPath))) {
        const target = this.find(lookPath, name);

        if (target) return target;
      }
    }
  }

  /**
   * Finding target dir in the directory.
   * @param dir
   * @param target
   */
  private find(dir, target): string {
    try {
      const dirs = fs.readdirSync(dir);
      for (let n = 0; n < dirs.length; n += 1) {
        if (dirs[n] === target) {
          return path.join(dir, target);
        }
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * lookup the project root path depended on package.json
   *
   * @param dir
   * @return project root path of the argument.
   */
  private lookupProjectRoot(dir): string {
    try {
      const list: string[] = fs.readdirSync(dir);
      for (let i = 0; i < list.length; i += 1) {
        const name = list[i];
        if (name === 'package.json') {
          return dir;
        }
      }
      return this.lookupProjectRoot(path.join(dir, '../'));
    } catch (error) {
      console.error(error);
    }
  }
}
