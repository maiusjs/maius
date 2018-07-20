import * as Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import IUserConfig from '../interface/i-user-config';
import IUserOptions from '../interface/i-user-options';

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

  private getConfig() {
    const filename = path.join(this.options.rootDir, 'config.js');
    if (!fs.statSync(filename)) {
      throw new Error('Not found config.js in project root directory!');
    }

    const config = require(filename);

    if (!config.env) {
      config.env = process.env.MAIUS_ENV || process.env.NODE_ENV || 'dev';
    }

    config.logger = Object.assign(
      {
        directory: path.resolve(this.options.rootDir, './logs'),
        level: config.env === 'dev' ? 'DEBUG' : 'ERROR',
      },
      config.logger || {});

    debug('User config: %o', config);

    return config;
  }
}
