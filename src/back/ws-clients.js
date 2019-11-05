/**
 * Manages connected ws clients.
 */
const logger = require('loggee').create('ws-clients');
const PromisedMap = require('promised-map');
const Timeout = require('await-timeout');
const {throwError} = require('throw-utils');
const protocol = require('../shared/protocol');

const PROXY_TIMEOUT = 2000;
const AUTH_CODE_TIMEOUT = 3 * 60 * 1000;

module.exports = class WsClients {
  /**
   * Constructor
   */
  constructor() {
    this._clients = new Map();
  }

  /**
   * Register new connected client.
   * @param {Object} client
   */
  register(client) {
    logger.log(`WS client connected`);
    this._clients.set(client, {
      devices: [],
      authCode: '',
      authCodeTime: 0,
      pendingRequests: new PromisedMap()
    });
    client.on('message', message => this._handleMessage(client, message));
    client.on('close', (...args) => this._handleClose(client, ...args));
  }

  /**
   * Tries to authorize client by code
   * @param {string} code
   */
  tryAuthorize({authCode, userId, deviceName}) {
    const client = this._findClientForAuthCode(authCode);
    if (client) {
      const device = {userId, deviceName};
      const message = protocol.authSuccess.buildMessage(device);
      client.send(JSON.stringify(message));
      return true;
    }
  }

  /**
   * Tries to proxy request to ws client.
   * @param {Object} reqBody
   * @returns {Promise}
   */
  async tryProxy(reqBody) {
    const userId = reqBody.session.user_id;
    const client = this._findClientForUserId(userId);
    if (client) {
      logger.log(`Proxying request to: ${userId}`);
      return Promise.race([
        this._proxy(reqBody, client),
        Timeout.set(PROXY_TIMEOUT, `Timeout: ${PROXY_TIMEOUT}`),
      ]);
    }
  }

  _handleMessage(client, {type, utf8Data}) {
    if (type !== 'utf8') {
      logger.error(`Unsupported message type: ${type}`);
      return;
    }
    const message = JSON.parse(utf8Data);
    if (protocol.requestAuthCode.is(message)) {
      this._handleRequestAuthCode(client);
    }
    if (protocol.sendDevices.is(message)) {
      const info = this._clients.get(client);
      info.devices = message.payload || [];
    }
    if (protocol.aliceMessage.is(message)) {
      this._handleAliceMessage(client, message);
    }
  }

  _handleClose(client) {
    const info = this._clients.get(client);
    if (info) {
      this._clients.delete(client);
      logger.log(`WS client disconnected: ${info.userId}`);
      info.pendingRequests.rejectAll(new Error('WS client disconnected'));
    }
  }

  async _proxy(reqBody, client) {
    const pendingRequests = this._getPendingRequests(client);
    const message = protocol.aliceMessage.buildMessage(reqBody, Date.now());
    client.send(JSON.stringify(message));
    return pendingRequests.wait(message.id);
  }

  _handleAliceMessage(client, message) {
    const pendingRequests = this._getPendingRequests(client);
    if (pendingRequests.has(message.id)) {
      pendingRequests.resolve(message.id, message.payload);
    } else {
      logger.error(`Unknown request id: ${JSON.stringify(message)}`);
    }
  }

  _handleRequestAuthCode(client) {
    const authCode = this._generateAuthCode();
    if (authCode) {
      const info = this._clients.get(client);
      info.authCode = authCode;
      info.authCodeTime = Date.now();
      const message = protocol.requestAuthCode.buildMessage(info.authCode);
      client.send(JSON.stringify(message));
    } else {
      const message = protocol.requestAuthCode.buildError('Can not generate auth code.');
      client.send(JSON.stringify(message));
    }
  }

  _findClientForUserId(userId) {
    for (const [client, info] of this._clients) {
      if (info.devices.some(device => device.userId === userId)) {
        return client;
      }
    }
  }

  _findClientForAuthCode(authCode) {
    for (const [client, info] of this._clients) {
      if (info.authCode === authCode && Date.now() - info.authCodeTime < AUTH_CODE_TIMEOUT) {
        return client;
      }
    }
  }

  _getPendingRequests(client) {
    const {pendingRequests} = this._clients.get(client) || {};
    return pendingRequests || throwError('WS connection closed');
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
