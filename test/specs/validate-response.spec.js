describe('validate-response', () => {

  let user;

  before(async () => {
    user = new User();
    await pageHelper.reloadPageForUserId(user.id);
    await page.click(PO.proxyUrl.radio);
    await pageHelper.setInputValue(PO.proxyUrl.input, skillServer.getUrl());
  });

  afterEach(async () => {
    skillServer.resetHandler();
  });

  it('show validation errors', async () => {
    // invalid response from skill
    skillServer.setHandler(() => {
      const response = {
        text: 'привет',
        tts: true,
        buttons: [{
          title: 'x'.repeat(65)
        }],
      };
      return {response, version: '1.0'};
    });

    await user.enter();
    assert.deepEqual(user.response.text.split('\n'), [
      'Error: Неверный тип поля "response.tts": "boolean" вместо "string"',
      'Превышена длина поля "response.buttons.0.title": 65, максимум 64',
      'Отсутствует обязательное поле "response.end_session"',
      'Отсутствует обязательное поле "session"',
    ]);
    assert.equal(user.response.tts, 'Ошибка');

    assert.deepEqual((await pageHelper.getChatMessages())[1].split('\n'), [
      'Error: Неверный тип поля "response.tts": "boolean" вместо "string"',
      'Превышена длина поля "response.buttons.0.title": 65, максимум 64',
      'Отсутствует обязательное поле "response.end_session"',
      'Отсутствует обязательное поле "session"',
    ]);
  });

});
