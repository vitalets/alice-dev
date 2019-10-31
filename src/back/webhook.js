/**
 * Handles Alice requests: proxy to client or
 */
const micro = require('micro');
const {reply, text, tts} = require('alice-renderer');

module.exports = class Webhook {
  /**
   * @param {WsClients} wsClients
   * @param {Request} req
   */
  constructor(wsClients, req) {
    this._wsClients = wsClients;
    this._req = req;
    this._reqBody = null;
  }

  /**
   * @returns {Promise}
   */
  async handle() {
    try {
      this._reqBody = await micro.json(this._req) || {};
      const resBody = await this._wsClients.tryProxy(this._reqBody);
      return resBody || this._showInstruction();
    } catch (e) {
      return this._showError(e);
    }
  }

  _showInstruction() {
    const response = reply`${text(`
      Здесь вы можете отлаживать локальную версию вашего навыка без публикации в каталоге.
      Откройте на компьютере сайт: https://alice-dev.vitalets.xyz и следуйте инструкции.
    `)}`;
    return this._buildResBody(response);
  }

  _showError(e) {
    const response = reply`
      ${text(e.message)}
      ${tts('Ошибка')}
    `;
    return this._buildResBody(response);
  }

  _buildResBody(response) {
    const {session, version} = this._reqBody;
    return {response, session, version};
  }
};
