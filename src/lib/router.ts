import * as KoaRouter from 'koa-router';

export default class Router extends KoaRouter {
  private maius: any;

  /**
   * @constructor
   * @param {object} opts koa-router options
   */

  constructor(opts: KoaRouter.IRouterOptions) {
    super(opts);
  }

  /**
   *
   */

  // tslint:disable-next-line:no-empty
  public resources(...args) { }
}
