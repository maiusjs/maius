import * as KoaApplication from 'koa';
import { httpClient, HttpClient } from './httpclient';

export default class Application extends KoaApplication {
  public httpClient: HttpClient = null;
  constructor() {
    super();
    this.httpClient = httpClient;
  }
}
