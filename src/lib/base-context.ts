import Maius from '../maius';
import { HttpClient, httpClient } from './httpclient';

export default class BaseContext {
  public baseConstructor: typeof BaseContext;
  public app: Maius;

  constructor(maius: Maius) {
    this.app = maius;
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
