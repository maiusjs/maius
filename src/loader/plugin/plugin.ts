import * as Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import Maius from '../../maius';
import PluginOneLoader from './plugin-one';

const debug = Debug('maius:PluginLoader');

export default class PluginLoader {
  /**
   * The config merged by all plugins config.
   */
  public mergedConfig: object;

  private app: Maius;
  private dirnameList: string[];

  /**
   * Create a pluginLoader
   *
   * @param app - The instance of Maius program.
   * @param dirnameList - an array contained the absolute path of the mutli plugin directory.
   */
  constructor(app: Maius, dirnameList: string[]) {
    this.app = app;
    this.dirnameList = dirnameList;
    this.mergedConfig = {};

    debug('dirname list: %o', dirnameList);

    this.loadAllPlugin();
  }

  /**
   * load all plugin from this.dirnameList
   */
  private loadAllPlugin() {
    for (let i = 0; i < this.dirnameList.length; i += 1) {
      const dirname = this.dirnameList[i];
      console.log('555', dirname, i, this.dirnameList.length);

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

      console.log('plugin one:', dirname);
      // load one plugin
      try {
        const pluginOneLoader = new PluginOneLoader(dirname, this.app);
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
