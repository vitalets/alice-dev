/**
 * Proxy alice request to url and wait response.
 */

// module.exports = class Proxy {
//   /**
//    * Constructor
//    * @param {object} store
//    */
//   constructor(store) {
//     this.store = store;
//   }
//
//   get proxyUrl() {
//     return this.store.getState().proxyUrl;
//   }
//
//   async getResponse(requestBody) {
//     const response = await fetch(this.proxyUrl, {
//       method: 'POST',
//       body: JSON.stringify(requestBody),
//     });
//     return response.ok ? response.json() : {};
//   }
// };

export async function getProxiedResponse(proxyUrl, requestBody) {
  const response = await fetch(proxyUrl, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  return response.ok ? response.json() : {};
}
