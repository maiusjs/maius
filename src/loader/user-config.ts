import * as Debug from 'debug';
import * as fs from 'fs';
import merge = require('lodash.merge');
import * as path from 'path';
import IUserConfig from '../interface/i-user-config';
import IUserOptions from '../interface/i-user-options';
import { isObject } from '../utils/type';

const debug = Debug('maius:userConfigLoader');

export default class UserConfigLoader {

  /**
   * Create a instance. Because this Class is an single instance class, will have
   * only one instance, so this methods only be called
   *
   * @param options
   * @returns UserConfigLoader instance
   */

  public static create(options: IUserOptions): UserConfigLoader {
    if (UserConfigLoader.instance) {
      throw new Error(`UserConfigLoader has been instantiated!
Please call UserConfigLoader.getInstance() to get instance.`);
    }
    UserConfigLoader.instance = new UserConfigLoader(options);
    return UserConfigLoader.instance;
  }

  /**
   * Get the instance.
   *
   * @returns UserConfigLoader instance
   */

  public static getIntance() {
    if (!UserConfigLoader.instance) {
      throw new Error(`UserConfigLoader has not been instantiated!
      Please call UserConfigLoader.create(options) to instantiate a instance.`);
    }
    return UserConfigLoader.instance;
  }

  private static instance: UserConfigLoader = null;

  public options: IUserOptions;
  public config: IUserConfig;

  /**
   * This is an single instance class.
   *
   * @constructor
   */

  private constructor(options: IUserOptions) {
    this.options = options;
    this.config = this.getConfig();
  }

  /**
   * Get user config
   */

  private getConfig() {
    let config: any = null;

    // work with config.js
    try {
      config = require(path.join(this.options.rootDir, 'config.js'));
    } catch (e) {
      config = this.mergeMultiUserConfig();
    }

    if (!config) {
      return;
    }

    if (!config.env) {
      config.env = process.env.NODE_ENV || 'dev';
    }

    config.logger = Object.assign(
      {
        directory: path.resolve(this.options.rootDir, './logs'),
        level: config.env === 'dev' ? 'DEBUG' : 'ERROR',
      },
      config.logger || {});

    debug('config: %o', config);

    return config;
  }

  private mergeMultiUserConfig() {
    const config: any = {};
    const dirpath = path.join(this.options.rootDir, 'config');
    const defaultConfigFilePath = path.join(dirpath, 'config.js');
    const dirList: string[] = [];

    // check is there config directory.
    let fileList: string[];
    try {
      fileList = fs.readdirSync(dirpath);
    } catch (error) {
      debug('Not found config directory');
      return null;
    }

    debug('%s %o', 'config filelist', fileList);

    // load config/config.js
    if (defaultConfigFilePath) {
      try {
        const content = require(defaultConfigFilePath);
        if (isObject(content)) {
          // this config is empty now, so we also cloud write: config = content;
          Object.assign(config, content);
        }
      } catch (error) {
        console.warn(error);
      }
    }

    // handle the config file, and push all direction path in to an array.
    for (let i = 0; i < fileList.length; i += 1) {
      const name: string = fileList[i]; // file name
      const filepath: string = path.join(dirpath, name);

      const stat = fs.statSync(filepath);
      const isFile: boolean = stat.isFile();
      const isDirectory: boolean = stat.isDirectory();

      try {
        if (isFile) {
          this.mergeConfigByFile(filepath, config);
        } else if (isDirectory) {
          dirList.push(filepath);
        }
      } catch (e) {
        continue;
      }

    }

    // handle the config file in some direction.
    for (let i = 0; i < dirList.length; i += 1) {
      const filepath = dirList[i];
      this.mergeConfigByDirectory(filepath, config);
    }

    debug('%s %o', 'Read user config:', config);
    return config;
  }

  private mergeConfigByFile(filepath, config) {
    let content: any = null;

    const basename = path.basename(filepath, path.extname(filepath));

    try {
      // load single file config
      content = require(filepath);

      // single file must export out an object
      if (!isObject(content)) {
        throw new Error('Must export out an object');
      }

      // check is it illegal
      const rst = /^[a-zA-Z_$][\w$]*$/.exec(basename);
      if (!rst) {
        debug('%s %o', 'regexp result', rst);
        throw new Error(`Mounting config property failed.
Please make sure that the config file name dose not contain illegal characters of javascript.`);
      }

      // config/config.js had handled, so will jump it.
      if (basename === 'config') {
        return;
      }

      merge(config[basename], content);
      // config[basename] = content;

    } catch (error) {
      console.warn(`Load config error in the file: ${filepath}`);
      console.warn(error);
    }
  }

  private mergeConfigByDirectory(dirPath, config) {
    const supportInnerDir: string[] = ['env'];
    const basename = path.basename(dirPath, path.extname(dirPath));

    if (supportInnerDir.indexOf(basename) < 0) {
      return;
    }

    if (basename === 'env') {
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

          merge(config, content);

        } catch (e) {
          continue;
        }
      }
    }
  }
}
