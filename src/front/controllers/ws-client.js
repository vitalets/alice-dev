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
  constructor(url, getState) {
    this._createWSP(url);
    // this.mode = WSClient.MODE_FIXED_RESPONSE;
    // this.aliceResponse = {test: '', tts: ''};
    // this.proxyUrl = '';
    this.getState = getState;
    this.onAliceRequest = new Channel();
    this.onAliceResponse = new Channel();
  }

  get mode() {
    return this.getState().mode;
  }

  get aliceResponse() {
    return this.getState().aliceResponse;
  }

  get proxyUrl() {
    return this.getState().proxyUrl;
  }

  async connect() {
    await this.wsp.open();
  }

  async close() {
    if (this.wsp) {
      await this.wsp.close();
    }
  }

  _createWSP(url) {
    this.wsp = new WebSocketAsPromised(url, wspOptions);
    this.wsp.onUnpackedMessage.addListener(message => this._handleMessage(message));
    // todo: handle close
  }

  async _handleMessage(message) {
    if (protocol.aliceMessage.check(message)) {
      const responseBody = await this._handleAliceRequest(message.payload);
      const outMessage = protocol.aliceMessage.buildResponse(message.id, responseBody);
      this.wsp.sendPacked(outMessage);
    }
  }

  async _handleAliceRequest(requestBody) {
    this.onAliceRequest.dispatch(requestBody);
    const responseBody = this.mode === WSClient.MODE_PROXY_URL
      ? await this._waitProxyResponse(requestBody)
      : this._buildFixedResponse(requestBody);
    this.onAliceResponse.dispatch(responseBody);
    return responseBody;
  }

  _buildFixedResponse(requestBody) {
    const {session, version} = requestBody;
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
