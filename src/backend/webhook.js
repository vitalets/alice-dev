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
      return resBody || this._tryAuthorize() || this._showInstruction();
    } catch (e) {
      return this._showError(e);
    }
  }

  _showInstruction() {
    const response = reply`
      Здесь вы можете отлаживать ваши навыки без публикации в каталоге.
      ${text('Откройте на компьютере сайт:\n🌐 https://alice-dev.vitalets.xyz\nи следуйте инструкции.')}
    `;
    return this._buildResponseBody(response);
  }

  _showError(e) {
    const response = reply`
      ${text(e.message)}
      ${tts('Ошибка')}
    `;
    return this._buildResponseBody(response);
  }

  _showAuthSuccess() {
    const response = reply`
      Код принят. Теперь вы можете отлаживать ваши навыки на этом устройстве.
    `;
    return this._buildResponseBody(response);
  }

  _showAuthIncorrect() {
    const response = reply`
      Неверный или устаревший код.
      Обновите страницу ${text('https://alice-dev.vitalets.xyz')} и попробуйте еще раз.
    `;
    return this._buildResponseBody(response);
  }

  _buildResponseBody(response) {
    const {session, version} = this._reqBody;
    return {response, session, version};
  }

  _tryAuthorize() {
    const authCode = this._extractCode();
    if (authCode) {
      const success = this._wsClients.tryAuthorize({
        authCode,
        userId: this._reqBody.session.user_id,
        deviceName: this._reqBody.meta.client_id,
      });
      return success
        ? this._showAuthSuccess()
        : this._showAuthIncorrect();
    }
  }

  _extractCode() {
    const { request } = this._reqBody;
    return request.nlu && request.nlu.entities && request.nlu.entities
      .filter(entity => entity.type ==='YANDEX.NUMBER')
      .map(entity => entity.value)
      .join('');
  }
};
