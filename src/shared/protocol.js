/**
 * Client-server ws communication protocol
 */

class Message {
  constructor(type) {
    this._type = type;
  }

  /**
   * Checks is obj instance of message.
   * @param {*} message
   */
  is(message) {
    return message && message.type === this._type;
  }

  /**
   * Builds message.
   * @param {*} [payload]
   * @param {string|number} [id]
   */
  buildMessage(payload, id) {
    return {
      type: this._type,
      payload,
      id,
    };
  }

  /**
   * Builds error message.
   * @param {string|Error} error
   * @param {string|number} [id]
   */
  buildError(error, id) {
    return {
      type: this._type,
      error: true,
      payload: (error && error.message) || String(error),
      id,
    };
  }
}

module.exports = {
  requestAuthCode: new Message('requestAuthCode'),
  sendDevices: new Message('sendDevices'),
  aliceMessage: new Message('aliceMessage'),
  authSuccess: new Message('authSuccess'),
};
