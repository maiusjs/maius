import { IPluginConfig } from '../../../core/loader/plugin/plugin-one';
import Maius from '../../../maius';

module.exports = (options: any, app: Maius, pluginConfig: IPluginConfig) => {
  return app.router.routes();
};
