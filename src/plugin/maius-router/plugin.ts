import Router from '../../core/lib/router';
import { IPluginOptions } from '../../core/loader/plugin/plugin-one';
import Maius from '../../maius';

export default class MaiusRouter {
  constructor(app: Maius, plugConfig: IPluginOptions) {
    app.router = new Router();
  }
}
