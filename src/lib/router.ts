import * as KoaRouter from 'koa-router';

export default class Router extends KoaRouter {
  private maius: any;

  /**
   * @constructor
   * @param {object} opts koa-router options
   * @param {Maius} maius Maius instance
   */

  constructor(opts, maius) {
    super(opts);
    this.maius = maius;
  }

  /**
   *
   */

  // tslint:disable-next-line:no-empty
  public resources(...args) { }
}
