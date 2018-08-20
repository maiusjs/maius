import * as Debug from 'debug';
import { Middleware } from 'koa';
import * as serve from 'koa-static';
import * as path from 'path';
import { IPluginConfig } from '../../core/loader/plugin/plugin-one';
import Maius from '../../maius';

const debug = Debug('maius:MaiusStatic');

type MiddlewareList = ((...args: any[]) => Middleware)[];

interface IStaticOptions extends IPluginConfig {
  options?: string[] | { root: string, options: serve.Options }[];
}

export default class MaiusStatic {
  public middleware: MiddlewareList;

  private app: Maius;

  /**
   * @prop this.options.name - 'maius-static'
   * @prop this.options.options {string[] | {root, options}[]}
   */
  private options: IStaticOptions;

  /**
   * @param app
   * @param {IMaiusStaticOptItem} config.options
   */
  constructor(app: Maius, options: IStaticOptions) {
    this.app = app;
    this.options = options;

    this.useMiddleware();
  }

  /**
   * use middleware
   */
  private useMiddleware(): void {
    if (!Array.isArray(this.options.options)) {
      console.warn(
        'Expect an array as the options.options, but got a',
        typeof this.options.options,
      );
      return;
    }

    /**
     * @prop this.options.name - 'maius-static'
     * @prop this.options.options {string[] | {root, options}[]}
     */
    const opts = this.options.options;
    debug('config: %o', opts);

    for (let i = 0; i < opts.length; i += 1) {
      const item = opts[i];
      let root;
      let options;

      if ('string' === typeof item) {
        root = path.isAbsolute(item)
          ? item
          : path.join(this.app.options.rootDir, item);
      } else {
        root = item.root;
        options = item.options;
      }

      debug('root: %s, options: %o', root, options);
      this.app.use(serve(root, options));
    }
  }
}
