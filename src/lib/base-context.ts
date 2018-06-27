import Maius, { MaiusContext } from '../maius';

export default class BaseContext {
  public baseConstructor: typeof BaseContext;
  public app: Maius;
  public ctx: MaiusContext;

  constructor(maius: Maius) {
    this.app = maius;
    this.ctx = maius.ctx;
  }

  /**
   * @alias this.app.controller
   */

  get controller() {
    return this.app.controller;
  }

  /**
   * @alias this.app.service
   */

  get service() {
    return this.app.service;
  }

  /**
   * @alias this.app.httpClient
   */

  get httpClient() {
    return this.app.httpClient;
  }
}
