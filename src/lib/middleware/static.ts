import * as fs from 'fs';
import * as serve from 'koa-static';
import * as path from 'path';
import IUserConfig from '../../interface/i-user-config';
import IUserOptions from '../../interface/i-user-options';
import UserConfigLoader from '../../loader/user-config';
import Maius from '../../maius';
import ConfigMiddlewareItemModel from '../../models/mdw-opts-model';
import { isObject } from '../../utils/index';
import { BaseMiddleware } from './base';

export default class Static extends BaseMiddleware {
  private staticPath: string;
  private staticOpts: serve.Options;
  private userConfig: IUserConfig;
  private userOptions: IUserOptions;
  private opts: serve.Options;

  constructor(maius: Maius) {
    super(maius);

    this.userConfig = UserConfigLoader.getIntance().config;
    this.userOptions = UserConfigLoader.getIntance().options;

    this.staticPath = path.join(this.userOptions.rootDir, 'public');
  }

  public getMiddlewareOpts(opts?: ConfigMiddlewareItemModel): typeof opts {
    const cfg = new ConfigMiddlewareItemModel();
    const publicPath = path.join(this.userOptions.rootDir, 'public');

    try {
      fs.readdirSync(publicPath);
    } catch (e) {
      // return;
    }

    cfg.name = 'maius:static';
    cfg._couldReorder = true;

    cfg.load = app => app.use(serve(this.staticPath, this.staticOpts));

    const iopts = isObject(opts) ? opts : new ConfigMiddlewareItemModel();
    return this.merge(cfg, iopts);
  }
}
