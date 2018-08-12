import Maius from '../../maius';
import ConfigMiddlewareItemModel from '../../models/mdw-opts-model';
import { BaseMiddleware } from './base';

export default class RouterMdw extends BaseMiddleware {

  constructor(maius: Maius) {
    super(maius);
  }

  public getMiddlewareOpts(): ConfigMiddlewareItemModel {
    const opts = new ConfigMiddlewareItemModel();

    opts._couldReorder = true;
    opts.name = 'maius:router';

    opts.load = app => app.use(this.maius.router.routes());

    return opts;
  }
}
