import * as assert from 'assert';
import * as Debug from 'debug';
import * as fs from 'fs';
import * as koaViews from 'koa-views';
import * as path from 'path';
import IUserConfig from '../../interface/i-user-config';
import IUserOptions from '../../interface/i-user-options';
import UserConfigLoader from '../../loader/user-config';
import Maius from '../../maius';
import ConfigMiddlewareItemModel from '../../models/mdw-opts-model';
import { isObject } from '../../utils/index';
import { BaseMiddleware } from './base';

const debug = Debug('maius:viewsMiddlware');
type IConfig = IUserConfig['views'];

export default class Static extends BaseMiddleware {
  private userConfig: IUserConfig;
  private userOptions: IUserOptions;
  private supportMap: Map<string, IConfig>;
  private viewsConfig: IConfig;

  constructor(maius: Maius) {
    super(maius);

    this.userConfig = UserConfigLoader.getIntance().config;
    this.userOptions = UserConfigLoader.getIntance().options;

    this.supportMap = new Map([
      ['ejs', { engine: 'ejs', extension: 'ejs', dir: 'views' }],
      ['nunjucks', { engine: 'nunjucks', extension: 'html', dir: 'views' }],
    ]);

    this.viewsConfig = this.makeViewsConfig();
  }

  public getMiddlewareOpts(opts?: ConfigMiddlewareItemModel): typeof opts {
    const cfg = new ConfigMiddlewareItemModel();
    cfg.name = 'maius:views';
    cfg._couldReorder = true;

    const userCustomFilter =  this.getUserCustomFliter();
    let options = this.viewsConfig;
    if (userCustomFilter != null) {
      options = Object.assign(this.viewsConfig, userCustomFilter);
    }

    cfg.load = app => {
      app.use(koaViews(this.viewsDir(), options));
    };

    const iopts = isObject(opts) ? opts : new ConfigMiddlewareItemModel();
    return this.merge(cfg, iopts);
  }

  private getUserCustomFliter(): object {
    const rootDir = this.maius.options.rootDir;
    const flieName = 'filter';
    const ext = '.js';
    const fullFileName = `${flieName}${ext}`;
    const filterDir = `${rootDir}/extend`;
    if (!fs.existsSync(filterDir) || !fs.existsSync(`${filterDir}/${fullFileName}`)) {
      debug('no filter file found');
      return null;
    }
    const fliterObj = require(`${filterDir}/${fullFileName}`);
    const obj = {
      options: {
        helpers: {},
      },
    };
    Object.keys(fliterObj).forEach(key => {
      obj.options.helpers[key] = fliterObj[key];
    });
    return obj;

  }
  /**
   * @returns the path of views template directory
   */

  private viewsDir() {
    return path.join(this.userOptions.rootDir, this.viewsConfig.dir);
  }

  /**
   * merge with users views config.
   *
   * @returns merged config.
   */

  private makeViewsConfig(): IConfig {
    const userConfig = this.userConfig.views;
    const engine = (userConfig && userConfig.engine) || 'ejs';

    const config = this.supportMap.get(engine);

    assert(config, 'The framework did not found the view engine you want to use, ' +
      'you can use these view engine: ' +
      [...this.supportMap.keys()].map(item => `"${item}"`).join(', '));

    config.dir = (userConfig && userConfig.dir) || config.dir;
    config.extension = (userConfig && userConfig.extension) || config.extension;

    debug('engineConfig %o', config);

    return config;
  }
}
