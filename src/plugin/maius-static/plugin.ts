import { Middleware } from 'koa';
import * as serve from 'koa-static';
import * as path from 'path';
import { IPluginOptions } from '../../core/loader/plugin/plugin-one';
import Maius from '../../maius';

type MiddlewareList = ((...args: any[]) => Middleware)[];

interface IStaticOptions extends IPluginOptions {
  options?: string[] | { root: string, options: serve.Options }[];
}

export default class MaiusStatic {
  public middleware: MiddlewareList;

  private app: Maius;
  private options: IStaticOptions;

  /**
   *
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
     * @pararm this.options.name - 'maius-static'
     * @pararm this.options.options {string[] | {root, options}[]}
     */
    const opts = this.options.options;

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

      this.app.use(serve(root, options));
    }
  }
}
