/**
 * Websocket client.
 */
const WebSocketAsPromised = require('websocket-as-promised');
const Channel = require('chnl');
const aliceLogger = require('loggee').create('alice');
const protocol = require('../../shared/protocol');

const wspOptions = {
  packMessage: data => JSON.stringify(data),
  unpackMessage: data => JSON.parse(data)
};

// use module.exports for nodejs
module.exports = class WSClient {
  static MODE_PROXY_URL = 0;
  static MODE_FIXED_RESPONSE = 1;
  static onFixedAnswerChanged = new Channel();
  static onProxyUrlChanged = new Channel();
  static onModeChanged = new Channel();
  /**
   * Constructor
   * @param {string} url
   */
  constructor(url) {
    this._createWSP(url);
    this.mode = WSClient.MODE_FIXED_RESPONSE;
    this.aliceResponse = {test: '', tts: ''};
    this.proxyUrl = '';
  }

  async connect() {
    await this._wsp.open();
  }

  async close() {
    if (this._wsp) {
      await this._wsp.close();
    }
  }

  _createWSP(url) {
    this._wsp = new WebSocketAsPromised(url, wspOptions);
    this._wsp.onUnpackedMessage.addListener(message => this._handleMessage(message));
    // todo: handle close
  }

  _handleMessage(message) {
    if (protocol.aliceMessage.check(message)) {
      void this._handleAliceMessage(message);
    }
  }

  async _handleAliceMessage(message) {
    aliceLogger.log('REQUEST:', message.payload); // eslint-disable-line no-console
    const responseBody = this.mode === WSClient.MODE_PROXY_URL
      ? await this._waitProxyResponse(message)
      : this._buildFixedResponse(message);
    aliceLogger.log('RESPONSE:', responseBody); // eslint-disable-line no-console
    const outMessage = protocol.aliceMessage.buildResponse(message.id, responseBody);
    this._wsp.sendPacked(outMessage);
  }

  _buildFixedResponse(message) {
    const {session, version} = message.payload;
    return {
      response: this.aliceResponse,
      session,
      version,
    };
  }

  _waitProxyResponse() {
    // todo
  }
};
