/**
 * Client-server ws communication protocol
 */

class Message {
  constructor(type) {
    this._type = type;
  }

  /**
   * Checks is obj instance of message.
   * @param {*} obj
   */
  is(obj) {
    return obj && obj.type === this._type;
  }

  /**
   * Builds message for sending by websocket.
   * @param {*} payload
   */
  buildMessage(payload) {
    return {
      type: this._type,
      payload,
    };
  }

  /**
   * Builds request message with ID for sending by websocket.
   * @param {*} payload
   */
  buildRequest(payload) {
    return {
      type: this._type,
      id: Date.now(),
      payload,
    };
  }

  /**
   * Builds message for sending by websocket.
   * @param {*} id
   * @param {*} payload
   */
  buildResponse(id, payload) {
    return {
      type: this._type,
      id,
      payload,
    };
  }
}

module.exports = {
  requestAuthCode: new Message('requestAuthCode'),
  sendDevices: new Message('sendDevices'),
  aliceMessage: new Message('aliceMessage'),
  authSuccess: new Message('authSuccess'),
};
