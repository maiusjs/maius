import Router from '../../core/lib/router';
import { IPluginConfig } from '../../core/loader/plugin/plugin-one';
import Maius from '../../maius';

export default class MaiusRouter {
  constructor(app: Maius, plugConfig: IPluginConfig) {
    app.router = new Router();
  }
}
