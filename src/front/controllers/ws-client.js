/**
 * Websocket client.
 */
const WebSocketAsPromised = require('websocket-as-promised');
const aliceLogger = require('loggee').create('alice');
const protocol = require('../../shared/protocol');

const wspOptions = {
  packMessage: data => JSON.stringify(data),
  unpackMessage: data => JSON.parse(data)
};

// use module.exports for nodejs
module.exports = class WSClient {
  /**
   * Constructor
   * @param {string} url
   */
  constructor(url) {
    this._wsp = new WebSocketAsPromised(url, wspOptions);
    this._wsp.onUnpackedMessage.addListener(message => this._handleMessage(message));
    // todo: handle close
    this.setAliceResponse('');
  }

  async connect() {
    await this._wsp.open();
  }

  async close() {
    if (this._wsp) {
      await this._wsp.close();
    }
  }

  /**
   * Sets static response for Alice requests
   * @param {object} response
   */
  setAliceResponse(response) {
    this._aliceResponse = response || {text: ''};
  }

  _handleMessage(message) {
    if (protocol.aliceMessage.check(message)) {
      this._handleAliceMessage(message);
    }
  }

  _handleAliceMessage(message) {
    aliceLogger.log('REQUEST', message.payload); // eslint-disable-line no-console
    const {session, version} = message.payload;
    const outMessage = protocol.aliceMessage.buildResponse(message.id, {
      response: this._aliceResponse,
      session,
      version
    });
    aliceLogger.log('RESPONSE', outMessage); // eslint-disable-line no-console
    this._wsp.sendPacked(outMessage);
  }
};
