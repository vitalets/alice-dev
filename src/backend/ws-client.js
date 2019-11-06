/**
 * WS client wrapper.
 */
const logger = require('loggee').create('ws-client');
const PromisedMap = require('promised-map');
const Timeout = require('await-timeout');
const Channel = require('chnl');
const protocol = require('../shared/protocol');

const WS_RESPONSE_TIMEOUT = 2000;
const AUTH_CODE_TIMEOUT = 3 * 60 * 1000;

module.exports = class WSClient {
  /**
   * Constructor
   */
  constructor(connection) {
    this._connection = connection;
    this._devices = [];
    this._authCode = '';
    this._authCodeTime = 0;
    this._pendingRequests = new PromisedMap();
    this.onRequestAuthCode = new Channel();
    connection.on('message', message => this._handleMessage(message));
  }

  /**
   * Adds new authorized device.
   * @param userId
   * @param deviceName
   */
  authorizeDevice({ userId, deviceName }) {
    logger.log(`Devices authorized: ${userId.slice(0, 6)} ${deviceName}`);
    this._devices.push({ userId, deviceName });
    const message = protocol.authSuccess.buildMessage({ userId, deviceName });
    this._send(message);
  }

  /**
   * Sets auth code and send ws message.
   *
   * @param {string} authCode
   */
  setAuthCode(authCode) {
    this._authCode = authCode;
    this._authCodeTime = Date.now();
    const message = protocol.requestAuthCode.buildMessage(authCode);
    this._send(message);
  }

  /**
   * Sets auth code error.
   *
   * @param {string} msg
   */
  setAuthCodeError(msg) {
    const message = protocol.requestAuthCode.buildError(msg);
    this._send(message);
  }

  /**
   * Is client has that provided userId.
   *
   * @param {string} userId
   * @returns {boolean}
   */
  hasUserId(userId) {
    return this._devices.some(device => device.userId === userId);
  }

  /**
   * Is authCode valid for that client.
   *
   * @param {string} authCode
   * @returns {boolean}
   */
  isValidAuthCode(authCode) {
    return this._authCode === authCode && Date.now() - this._authCodeTime < AUTH_CODE_TIMEOUT;
  }

  /**
   * Proxy alice request via websocket.
   *
   * @param {Object} reqBody
   * @returns {Promise}
   */
  async proxyAliceRequest(reqBody) {
    const messageId = Date.now();
    const message = protocol.aliceMessage.buildMessage(reqBody, messageId);
    this._send(message);
    return Promise.race([
      this._pendingRequests.wait(messageId),
      Timeout.set(WS_RESPONSE_TIMEOUT, `Websocket response timeout: ${WS_RESPONSE_TIMEOUT}`),
    ]);
  }

  /**
   * Cleanup.
   */
  destroy() {
    this._pendingRequests.rejectAll(new Error('WS client disconnected'));
  }

  _handleMessage({ utf8Data }) {
    const message = JSON.parse(utf8Data);
    if (protocol.requestAuthCode.is(message)) {
      this._authCode = '';
      this._authCodeTime = 0;
      this.onRequestAuthCode.dispatch();
    } else if (protocol.sendDevices.is(message)) {
      this._devices = message.payload || [];
    } else if (protocol.aliceMessage.is(message)) {
      this._handleAliceResponse(message);
    } else {
      logger.log(`Unknown message: ${utf8Data}`);
    }
  }

  _handleAliceResponse(message) {
    if (this._pendingRequests.has(message.id)) {
      this._pendingRequests.resolve(message.id, message.payload);
    } else {
      logger.error(`Unknown request id: ${JSON.stringify(message)}`);
    }
  }

  /**
   * Sends JSON message.
   *
   * @param {Object} message
   */
  _send(message) {
    this._connection.send(JSON.stringify(message));
  }
};
