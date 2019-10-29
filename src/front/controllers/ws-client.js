/**
 * Websocket client.
 */
const WebSocketAsPromised = require('websocket-as-promised');
const Channel = require('chnl');
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
    this._createWSP(url);
    this.onAliceRequest = new Channel();
  }

  get wsp() {
    return this._wsp;
  }

  async connect() {
    await this.wsp.open();
  }

  async close() {
    if (this.wsp) {
      await this.wsp.close();
    }
  }

  sendAliceResponse(messageId, responseBody) {
    const message = protocol.aliceMessage.buildResponse(messageId, responseBody);
    this._wsp.sendPacked(message);
  }

  _createWSP(url) {
    this._wsp = new WebSocketAsPromised(url, wspOptions);
    this._wsp.onUnpackedMessage.addListener(message => this._handleMessage(message));
  }

  async _handleMessage(message) {
    if (protocol.aliceMessage.check(message)) {
      this.onAliceRequest.dispatch(message.id, message.payload);
    }
  }
};
