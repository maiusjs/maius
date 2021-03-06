import * as Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import { IStaticConfig } from '../../plugin/maius-static/plugin';
import { isObject } from '../utils/type';
import { IMiddlewareConfig } from './middleware';

const debug = Debug('maius:PluginConfigLoader');
const log: {
  loadFileError: (filename: string, error: Error) => void;
} = {
  loadFileError(filename, error: Error) {
    console.error(`Load config error in the file: ${filename}\n`, error);
  },
};

interface IViewConfig {
  /**
   * view dirname
   */
  root: string;

  options: {
    /*
     * default extension for your views
     */
    extension?: string,
    /*
     * these options will get passed to the view engine
     */
    options?: any,
    /*
     * map a file extension to an engine
     */
    map?: any,
    /*
     * replace consolidate as default engine source
     */
    engineSource?: any,
  };
}

export interface ILoggerConfig {
  /**
   * Log file will save to
   */
  directory?: string;
  /**
   * Log log level
   */
  level?: string;
  /**
   * Need stdout
   */
  stdout?: boolean;
}

export interface IConfig {
  env?: string;
  middleware?: IMiddlewareConfig[];
  plugin?: { name: string, [x: string]: any }[];
  logger?: ILoggerConfig;
  view?: IViewConfig;
  static?: IStaticConfig['options'];
  [x: string]: any;
}

/**
 * Could get merged config of the `plugin/config/` by this.config.
 *
 * TODO: replace user-config.ts
 */
export default class ConfigLoader {
  private dirname: string;
  private config: IConfig;

  /**
   * Could get merged config of the `plugin/config/` by this.config.
   *
   * @param dirname The config directory path in the plugin.
   */
  constructor(dirname: string) {
    this.dirname = dirname;
    this.config = null;
  }

  /**
   * Get the merged user config
   * @return user config
   * @since 0.1.0
   */
  public getConfig(): IConfig {
    if (this.config) return this.config;
    this.config = this.mergeMultiUserConfig(this.dirname);
    return this.config;
  }

  /**
   * Merge all config files in the config directory.
   *
   * @returns - the merged config
   */
  private mergeMultiUserConfig(dirname): IConfig {
    const config: any = {};
    const defaultConfigFilePath = path.join(dirname, 'config.js');
    const dirList: string[] = [];

    // check is there config directory.
    let fileList: string[];
    try {
      fileList = fs.readdirSync(dirname);
    } catch (error) {
      debug('Not found config root directory: %s', dirname);
      return {};
    }

    // debug('file list in directory `plugin/config/` %o', fileList);

    // load config/config.js
    try {
      const content = require(defaultConfigFilePath);
      if (isObject(content)) {
        // the config is empty now, so we also cloud writen: config = content;
        Object.assign(config, content);
      }
    } catch (error) {
      // log.loadFileError(defaultConfigFilePath, error);
    }

    // loop the config primary directory, push all folder into an array, and
    // merge all file type config files.
    for (let i = 0; i < fileList.length; i += 1) {
      const name: string = fileList[i]; // file name
      const filepath: string = path.join(dirname, name);

      // check is it end with .js
      if (!/\.js$/.test(filepath)) continue;

      const stat = fs.statSync(filepath);
      const isFile: boolean = stat.isFile();
      const isDirectory: boolean = stat.isDirectory();

      try {
        // if it is file type, so handle it.
        if (isFile) {
          this.mergeConfigByFile(filepath, config);
        // if it is directory type, push it into an array.
        } else if (isDirectory) {
          dirList.push(filepath);
        }
      } catch (e) {
        continue;
      }
    }

    // Handled config files are contained in the folder below config directory.
    for (let i = 0; i < dirList.length; i += 1) {
      const filepath = dirList[i];
      this.mergeConfigFolder(filepath, config);
    }

    // debug('merged user config %o', config);
    return config;
  }

  /**
   * Merge files in the primart directory of config folder.
   *
   * @param filepath - The path of config file.
   * @param config - The merged config.
   */
  private mergeConfigByFile(filepath: string, config: object): void {
    let content: any = null;
    const basename = path.basename(filepath, path.extname(filepath));

    try {
      // load single file config
      content = require(filepath);

      // single file must export out an object
      // if (!isObject(content)) {
      //   throw new Error('Must export out an object');
      // }

      // check is it illegal
      const rst = /^[a-zA-Z_$][\w$]*$/.exec(basename);
      if (!rst) {
        throw new Error('Mounting config property failed, ' +
'Please make sure that the config file name dose not contain illegal characters of javascript.');
      }

      // config/config.js had handled, so will jump it.
      if (basename === 'config') {
        return;
      }

      // if (!config[basename]) {
      //   config[basename] = content;
      // } else {
      //   Object.assign(config[basename], content);
      // }

      config[basename] = content;

    } catch (error) {
      log.loadFileError(filepath, error);
    }
  }

  /**
   * Merge config files are contained in the folder below config directory.
   *
   * @param dirPath - Directory path of folder in the config directory.
   * @param config - The merged config.
   */
  private mergeConfigFolder(dirPath: string, config: object): void {
    // only scan config files in those folders
    const supportInnerDir: string[] = ['env'];
    const basename = path.basename(dirPath, path.extname(dirPath));

    if (supportInnerDir.indexOf(basename) < 0) {
      return;
    }

    if (basename === 'env') {
      this.folderEnv(dirPath, config);
    }
  }

  /**
   * Merge the config which the config file basename is equal to process.env.NODE_ENV
   *
   * @param dirPath - The absolute path of config/env/
   * @param config - The merged config.
   */
  private folderEnv(dirPath, config: object): void {
    const envFileList: string[] = fs.readdirSync(dirPath);

    // merge the config which the config file basename is equal to process.env.NODE_ENV
    for (let i = 0; i < envFileList.length; i += 1) {
      const envFilename = envFileList[i];
      const env = path.basename(envFilename, path.extname(envFilename));

      if (process.env.NODE_ENV !== env) continue;

      const stat = fs.statSync(path.join(dirPath, envFilename));

      // check is it a file
      if (!stat.isFile()) {
        continue;
      }

      try {
        const content = require(path.join(dirPath, envFilename));
        if (!isObject(content)) continue;
        Object.assign(config, content);

      } catch (e) {
        continue;
      }
    }
  }

}
