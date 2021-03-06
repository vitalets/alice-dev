/**
 * Manages connected ws clients.
 */
const logger = require('loggee').create('ws-clients');
const WSClient = require('./ws-client');

module.exports = class WSClients {
  /**
   * Constructor
   */
  constructor() {
    this._clients = new Set();
  }

  /**
   * Count of connected clients.
   * @returns {number}
   */
  get count() {
    return this._clients.size;
  }

  /**
   * Register new connected client.
   * @param {Object} connection
   */
  register(connection) {
    logger.log(`WS client connected`);
    const client = new WSClient(connection);
    this._clients.add(client);
    client.onRequestAuthCode.addListener(() => this._handleRequestAuthCode(client));
    client.onDevicesUpdated.addListener(() => this._disconnectClientsWithSameUserId(client));
    client.onDisconnected.addListener(() => this._deleteClient(client));
  }

  /**
   * Tries to authorize client by code
   * @param {string} code
   */
  tryAuthorize({authCode, userId, deviceName}) {
    const client = this._findClientForAuthCode(authCode);
    if (client) {
      client.authorizeDevice({userId, deviceName});
      return true;
    }
  }

  /**
   * Tries to proxy request to ws client.
   *
   * @param {Object} reqBody
   * @returns {Promise}
   */
  async tryProxy(reqBody) {
    const userId = reqBody.session.user_id;
    const client = this._findClientForUserId(userId);
    if (client) {
      logger.log(`Proxying alice request for: ${userId.slice(0, 6)}`);
      return client.proxyAliceRequest(reqBody);
    }
  }

  _deleteClient(client) {
    logger.log('WS client disconnected');
    this._clients.delete(client);
  }

  _findClientForUserId(userId) {
    for (const client of this._clients) {
      if (client.hasUserId(userId)) {
        return client;
      }
    }
  }

  _findClientForAuthCode(authCode) {
    for (const client of this._clients) {
      if (client.isValidAuthCode(authCode)) {
        return client;
      }
    }
  }

  /**
   * Only one clinet should be connected for userId as only one will respond.
   */
  _disconnectClientsWithSameUserId(newestClient) {
    for (const client of this._clients) {
      if (client === newestClient) {
        continue;
      }
      const hasSameUserId = newestClient.devices.some(device => client.hasUserId(device.userId));
      if (hasSameUserId) {
        // todo: add reason
        client.disconnect();
      }
    }
  }

  _handleRequestAuthCode(client) {
    const authCode = this._generateAuthCode();
    if (authCode) {
      logger.log(`Auth code generated: ${authCode}`);
      client.setAuthCode(authCode);
    } else {
      const message = 'Can not generate auth code.';
      logger.error(message);
      client.setAuthCodeError(message);
    }
  }

  _generateAuthCode() {
    for (let i = 0; i < 100; i++) {
      const authCode = Math.random().toString().slice(-4);
      const client = this._findClientForAuthCode(authCode);
      if (!client) {
        return authCode;
      }
    }
  }
};
