/**
 * Manages connected ws clients.
 */
const logger = require('loggee').create('ws-clients');
const PromisedMap = require('promised-map');
const Timeout = require('await-timeout');
const {throwError} = require('throw-utils');
const protocol = require('../shared/protocol');

const PROXY_TIMEOUT = 2000;

module.exports = class WsClients {
  /**
   * Constructor
   */
  constructor() {
    this._clients = new Map();
  }

  register(client, {userId}) {
    logger.log(`WS client connected (userId: ${userId})`);
    this._clients.set(client, {
      userId,
      pendingRequests: new PromisedMap()
    });
    client.on('message', message => this._handleMessage(client, message));
    client.on('close', (...args) => this._handleClose(client, ...args));
    // todo: authorization
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
    if (protocol.aliceMessage.check(message)) {
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
    const message = protocol.aliceMessage.buildRequest(reqBody);
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

  _findClientForUserId(userId) {
    for (const [client, info] of this._clients) {
      if (info.userId === userId) {
        return client;
      }
    }
  }

  _getPendingRequests(client) {
    const {pendingRequests} = this._clients.get(client) || {};
    return pendingRequests || throwError('WS connection closed');
  }
};
