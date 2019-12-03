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

  it('validate response (no images)', async () => {
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

  it('validate response (big image)', async () => {
    skillServer.setHandler(req => {
      const {session, version} = req.body;
      const response = {
        text: 'привет',
        tts: 'привет',
        end_session: false,
        card: {
          type: 'BigImage',
          title: 'x'.repeat(129)
        }
      };
      return {response, session, version};
    });

    await user.enter();
    assert.deepEqual(user.response.text.split('\n'), [
      'Error: Отсутствует обязательное поле "response.card.image_id"',
      'Превышена длина поля "response.card.title": 129, максимум 128'
    ]);
    assert.equal(user.response.tts, 'Ошибка');
  });

  it('validate response (items list)', async () => {
    skillServer.setHandler(req => {
      const {session, version} = req.body;
      const response = {
        text: 'привет',
        tts: 'привет',
        end_session: false,
        card: {
          type: 'ItemsList',
          header: {
            text: 'x'.repeat(65)
          },
          items: [{
            title: 'x'.repeat(129)
          }]
        }
      };
      return {response, session, version};
    });

    await user.enter();
    assert.deepEqual(user.response.text.split('\n'), [
      'Error: Превышена длина поля "response.card.header.text": 65, максимум 64',
      'Отсутствует обязательное поле "response.card.items.0.image_id"',
      'Превышена длина поля "response.card.items.0.title": 129, максимум 128'
    ]);
    assert.equal(user.response.tts, 'Ошибка');
  });

  it('dont validate response if checkbox unchecked', async () => {
    skillServer.setHandler(() => {
      const response = {
        text: 'привет',
        tts: true,
      };
      return {response};
    });

    await page.click(PO.validationCheckbox);
    await user.enter();

    assert.equal(user.response.text, 'привет');
  });
});
