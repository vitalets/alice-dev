/**
 * Helper to create and cleanup ws clients.
 */
const WSClient = require('../../src/front/ws-client');

const clients = new Set();

const config = {
  url: ''
};

const create = userId => {
  const client = new WSClient(config.url, {userId});
  clients.add(client);
  return client;
};

const closeAll = async () => {
  for (const client of clients) {
    await client.close();
  }
  clients.clear();
};

module.exports = {
  config,
  create,
  closeAll,
};
