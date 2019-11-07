/**
 * Proxy alice request to url.
 */

import Timeout from 'await-timeout';
import { store } from '../store';

const PROXY_TO_URL_TIMEOUT = 2000;

export default class ProxyToUrl {
  constructor(requestBody) {
    this._requestBody = requestBody;
  }

  async proxy() {
    return Promise.race([
      this._fetch(),
      this._startTimer(),
    ]);
  }

  async _fetch() {
    const proxyUrl = store.getState().proxyUrl;
    const response = await fetch(proxyUrl, {
      method: 'POST',
      body: JSON.stringify(this._requestBody),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Proxy URL: ${response.status} ${response.statusText}`);
    }
  }

  async _startTimer() {
    await Timeout.set(PROXY_TO_URL_TIMEOUT, `Proxy URL не ответил за ${PROXY_TO_URL_TIMEOUT} мс`);
  }
}

