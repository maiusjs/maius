import * as Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import Maius from '../../../maius';
import PluginOneLoader, { IPluginConfig } from './plugin-one';

const debug = Debug('maius:PluginListLoader');

export interface IPluginItem {
  dirname: string;
  config: IPluginConfig;
  module?: boolean; // is it npm package
}

export default class PluginListLoader {
  /**
   * The config merged by all plugins config.
   */
  public appConfig: object;

  private app: Maius;
  private pluginList: IPluginItem[];

  /**
   * Create a pluginLoader
   *
   * @param app - The instance of Maius program.
   * @param pluginList - an array of IPluginItem.
   */
  constructor(app: Maius, pluginList: IPluginItem[]) {
    this.app = app;
    this.pluginList = pluginList;
    this.appConfig = {};

    debug('Got plugin list will to load: %o', pluginList);
  }

  /**
   * load all plugin from this.dirnameList
   */
  public load() {
    for (let i = 0; i < this.pluginList.length; i += 1) {
      const { dirname, config } = this.pluginList[i];

      // check is safe
      if (!path.isAbsolute(dirname)) {
        throw new Error(`[Maius PluginLoader]: Expect '${dirname}'`
        + ' is a absolute path string in PluginLoader constructor second'
        + ` parameter \`dirname[${i}]\``);
      }

      // dirname have to a folder.
      try {
        const stat = fs.statSync(dirname);
        if (!stat.isDirectory) {
          continue;
        }
      } catch (error) {
        continue;
      }

      // load one plugin
      try {
        const pluginOneLoader = new PluginOneLoader(this.app, dirname, config);
      } catch (error) {
        console.log(error);
      }

      // merge config
      // this.mergeConfig(pluginOneLoader.config);
    }
  }

  /**
   * merge target config to this.mergedConfig
   *
   * @param targetConfig the new target config will be merged.
   */
  private mergeConfig(targetConfig) {
    Object.assign(this.mergeConfig, targetConfig);
  }
}
