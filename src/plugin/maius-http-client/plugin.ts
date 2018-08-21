import { httpClient } from '../../core/lib/httpclient';
import Maius from '../../maius';

export default class MaiusHttpClient {
  private app: Maius;

  constructor(app: Maius) {
    this.app = app;
    /**
     * Convenient to initiate http request on node server.
     * It provides a lot of convenient methods for requesting.
     *
     * e.g.
     *    httpClient.get('xx').then(res => console.log(res));
     *    httpClient.post('xx').then(res => console.log(res));
     *
     * @since 0.1.0
     */
    this.app.httpClient = httpClient;
  }
}
