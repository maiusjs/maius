import * as koaViews from 'koa-views';
import * as path from 'path';
import { IPluginOptions } from '../../../core/loader/plugin/plugin-one';
import Maius from '../../../maius';

module.exports = function maiusView(
  options: any,
  app: Maius,
  pluginConfig: IPluginOptions,
) {
  const root = path.join(app.options.rootDir, 'views');
  const opt = {
    extension: 'ejs',
    map: { ejs: 'ejs' },
  };

  return koaViews(root, opt);
};
