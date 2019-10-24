/**
 * Websocket client.
 */
const WebSocketAsPromised = require('websocket-as-promised');
const {buildUrl} = require('../shared/utils');
const protocol = require('../shared/protocol');

const wspOptions = {
  packMessage: data => JSON.stringify(data),
  unpackMessage: data => JSON.parse(data)
};

module.exports = class WSClient {
  constructor(url, {userId} = {}) {
    this._url = buildUrl(url, {userId});
  }

  async connect() {
    this._wsp = new WebSocketAsPromised(this._url, wspOptions);
    this._wsp.onUnpackedMessage.addListener(message => this._handleMessage(message));
    await this._wsp.open();
  }

  async close() {
    if (this._wsp) {
      await this._wsp.close();
    }
  }

  _handleMessage(message) {
    // console.log('client got message', message);
    if (protocol.aliceMessage.check(message)) {
      this._handleAliceMessage(message);
    }
  }

  _handleAliceMessage(message) {
    const response = {
      text: 'hello'
    };
    const {session, version} = message.payload;
    const outMessage = protocol.aliceMessage.buildResponse(message.id, {response, session, version});
    this._wsp.sendPacked(outMessage);
  }
};
