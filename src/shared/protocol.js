/**
 * Client-server ws communication protocol
 */

class MessageType {
  constructor(type, payloadFn = (data => data)) {
    this._type = type;
    this._payloadFn = payloadFn;
  }

  /**
   * Checks is obj instance of message.
   * @param {*} obj
   */
  check(obj) {
    return obj && obj.type === this._type;
  }

  /**
   * Builds message for sending by websocket.
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
   * @param {*} data
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
  aliceMessage: new MessageType('alice'),
};
