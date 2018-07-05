import * as serve from 'koa-static';
import * as path from 'path';
import IUserConfig from '../../interface/i-user-config';
import IUserOptions from '../../interface/i-user-options';
import UserConfigLoader from '../../loader/user-config';
import Maius from '../../maius';
import ConfigMiddlewareItemModel from '../../models/mdw-opts-model';
import { isObject } from '../../utils/type';
import { BaseMiddleware } from './base';

interface IStaticConfigItem {
  root: string;
  opts?: serve.Options;
}

export default class Static extends BaseMiddleware {
  private staticPath: string;
  private userConfig: IUserConfig;
  private userOptions: IUserOptions;
  private opts: serve.Options;
  private staticConfig: string | string[] | IStaticConfigItem[];
  private defaultConfig: IStaticConfigItem[];

  constructor(maius: Maius) {
    super(maius);

    this.userConfig = UserConfigLoader.getIntance().config;
    this.userOptions = UserConfigLoader.getIntance().options;

    this.staticConfig = this.userConfig.static;
  }

  public getMiddlewareOpts(opts?: ConfigMiddlewareItemModel): typeof opts {
    const loadList = [];
    const cfg = new ConfigMiddlewareItemModel();
    cfg.name = 'maius:static';
    cfg._couldReorder = true;

    if ('string' === typeof this.staticConfig) {
      loadList.push({
        opts: {},
        root: this.staticConfig,
      });

    } else if (Array.isArray(this.staticConfig)) {
      for (const item of this.staticConfig) {
        if ('string' === typeof item) {
          loadList.push({
            opts: {},
            root: item,
          });
          continue;
        }
        if ('object' === typeof item) {
          loadList.push(item);
        }
      }

    } else {
      loadList.push({
        opts: {},
        root: path.join(this.userOptions.rootDir, 'public'),
      });
    }

    cfg.load = app => {
      for (const item of loadList) {
        const root = path.isAbsolute(item.root) ?
          item.root :
          path.join(this.userOptions.rootDir, item.root);

        app.use(serve(root, item.opts));
      }
    };

    const iopts = isObject(opts) ? opts : new ConfigMiddlewareItemModel();
    return this.merge(cfg, iopts);
  }
}
