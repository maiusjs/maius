import * as Debug from 'debug';
import * as koaViews from 'koa-views';
import * as path from 'path';
import { isObject } from '../../../core/utils/type';
import Maius from '../../../maius';

const debug = Debug('maius:MaiusView');

module.exports = function maiusView(
  options: any,
  app: Maius,
) {
  const view = app.config.view;

  const root = view && 'string' === typeof view.root
    ? view.root
    : path.join(app.options.rootDir, 'view');

  const opts = view && isObject(view.options)
    ? view.options
    : { extension: 'ejs', map: { ejs: 'ejs' } };

  debug('root: %s, options: %o', root, opts);

  return koaViews(root, opts);
};
