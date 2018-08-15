import * as koaViews from 'koa-views';
import * as path from 'path';
import { isObject } from '../../../core/utils/type';
import Maius from '../../../maius';

module.exports = function maiusView(
  options: any,
  app: Maius,
) {
  const opts = app.config.view;

  const root = 'string' === typeof opts.root
    ? opts.root
    : path.join(app.options.rootDir, 'view');

  const opt = isObject(opts.options)
    ? opts.options
    : { extension: 'ejs', map: { ejs: 'ejs' } };

  return koaViews(root, opt);
};
