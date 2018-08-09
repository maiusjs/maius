import * as Debug from 'debug';
import * as fs from 'fs';
import { Middleware } from 'koa';
import * as path from 'path';
import { isFunction } from '../../utils/type';

const debug = Debug('maius:PluginMiddlewareLoader');

/**
 * Get all middleware fn, and filtered illegal middleware
 */
export default class PluginMiddlewareLoader {
  public middlewareCol: { [x: string]: Middleware };

  /**
   * @param dirname the middleware directory path.
   */
  constructor(dirname: string) {
    this.middlewareCol = this.collectMiddleware(dirname);
  }

  /**
   *
   * @param dirname the middleware directory
   * @return
   */
  private collectMiddleware(dirname: string): { [x: string]: Middleware } {
    const middlewareCol = {};
    let fileList: string[] = null;

    try {
      fileList = fs.readdirSync(dirname);
    } catch (error) {
      debug('Not found middleware root directory: %s', dirname);
      return middlewareCol;
    }

    for (let i = 0; i < fileList.length; i += 1) {
      const filename: string = fileList[i];
      const basename: string = path.basename(filename, path.extname(filename));
      const filepath: string = path.join(dirname, filename);
      // if this is a illegal middleware, will get a null as return value.
      const fn = this.requireMiddleware(filepath);

      if (fn) {
        middlewareCol[basename] = fn;
      }
    }

    return middlewareCol;
  }

  /**
   * Check is it a safe(legal) middleware function.
   *
   * @param filepath the middleware absolute path.
   * @return the middlware
   */
  private requireMiddleware(filepath): (Middleware | null) {
    try {
      const fn = require(filepath);
      if (isFunction(fn)) {
        return fn;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
