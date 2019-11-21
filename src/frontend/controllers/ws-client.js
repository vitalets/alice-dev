/**
 * Websocket client.
 */

// Importing from websocket-as-promised/src has smaller size
// see: https://github.com/vitalets/websocket-as-promised/issues/22
import WebSocketAsPromised from 'websocket-as-promised/src';
import Channel from 'chnl';
import protocol from '../../shared/protocol';

import {
  CONNECTION_STATE,
  dispatch,
  getState,
  setConnectionState,
  setAuthCode,
  addDevice,
  clearDevices,
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
    const message = protocol.aliceMessage.buildMessage(responseBody, messageId);
    this._wsp.sendPacked(message);
  }

  clearDevices() {
    dispatch(clearDevices());
    this._sendDevices();
    this._requestAuthCode();
  }

  _requestAuthCode() {
    dispatch(setAuthCode(''));
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
    if (getState().devices.length) {
      this._sendDevices();
    } else {
      this._requestAuthCode();
    }
  }

  async _handleMessage(message) {
    if (protocol.aliceMessage.is(message)) {
      this.onAliceRequest.dispatch(message.id, message.payload);
    }
    if (protocol.requestAuthCode.is(message)) {
      if (message.error) {
        // todo: show error
      } else {
        dispatch(setAuthCode(message.payload));
      }
    }
    if (protocol.authSuccess.is(message)) {
      dispatch(setAuthCode(''));
      dispatch(addDevice(message.payload));
    }
  }
}
