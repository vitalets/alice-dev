/**
 * Websocket client.
 */
import WebSocketAsPromised from 'websocket-as-promised';
import Channel from 'chnl';
import protocol from '../../shared/protocol';

import {
  CONNECTION_STATE,
  dispatch,
  getState,
  setConnectionState,
  setAuthCode,
  addDevice,
} from '../store';

const wspOptions = {
  packMessage: data => JSON.stringify(data),
  unpackMessage: data => JSON.parse(data)
};

export default class WSClient {
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

  _requestAuthCode() {
    const message = protocol.requestAuthCode.buildMessage();
    this._wsp.sendPacked(message);
  }

  _sendDevices() {
    const devices = getState().devices;
    const message = protocol.sendDevices.buildMessage(devices);
    this._wsp.sendPacked(message);
  }

  _createWSP(url) {
    this._wsp = new WebSocketAsPromised(url, wspOptions);
    this._wsp.onOpen.addListener(() => this._handleOpen());
    this._wsp.onClose.addListener(() => dispatch(setConnectionState(CONNECTION_STATE.DISCONNECTED)));
    this._wsp.onUnpackedMessage.addListener(message => this._handleMessage(message));
  }

  _handleOpen() {
    dispatch(setConnectionState(CONNECTION_STATE.CONNECTED));
    const devices = getState().devices;
    if (devices.length) {
      this._sendDevices(devices);
    } else {
      this._requestAuthCode();
    }
  }

  async _handleMessage(message) {
    if (protocol.aliceMessage.is(message)) {
      this.onAliceRequest.dispatch(message.id, message.payload);
    }
    if (protocol.requestAuthCode.is(message)) {
      dispatch(setAuthCode(message.payload));
    }
    if (protocol.authSuccess.is(message)) {
      dispatch(addDevice(message.payload));
    }
  }
}
