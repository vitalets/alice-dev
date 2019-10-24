/**
 * Helper to create and cleanup ws clients.
 */
const WSClient = require('../../src/front/controllers/ws-client');
const {buildUrl} = require('../../src/shared/utils');

const clients = new Set();

const config = {
  url: ''
};

const create = userId => {
  const url = buildUrl(config.url, {userId});
  const client = new WSClient(url);
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
