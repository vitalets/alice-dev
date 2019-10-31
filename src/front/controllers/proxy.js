/**
 * Proxy alice request to url.
 */

import { store } from '../store';

export async function getProxiedResponse(requestBody) {
  const proxyUrl = store.getState().proxyUrl;
  const response = await fetch(proxyUrl, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  return response.ok ? response.json() : {};
}
