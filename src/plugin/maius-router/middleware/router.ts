import { IPluginOptions } from '../../../core/loader/plugin/plugin-one';
import Maius from '../../../maius';

module.exports = (options: any, app: Maius, pluginConfig: IPluginOptions) => {
  return app.router.routes();
};
