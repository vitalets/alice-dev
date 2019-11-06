describe('proxy-to-url', () => {

  let user;

  beforeEach(async () => {
    user = new User();
    await pageHelper.reloadPageForUserId(user.id);
    await page.click(PO.proxyUrl.radio);
    await pageHelper.setInputValue(PO.proxyUrl.input, skillServer.getUrl());
  });

  afterEach(async () => {
    skillServer.resetHandler();
  });

  it('proxy for corresponding userId', async () => {
    await user.enter();
    assert.equal(user.response.text, 'Новая сессия');
    assert.equal(user.response.tts, 'Новая сессия');

    await user.say('Привет');
    assert.equal(user.response.text, 'В навык пришло: Привет');
    assert.equal(user.response.tts, 'В навык пришло: Привет');

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Новая сессия',
      'Привет',
      'В навык пришло: Привет'
    ]);
  });

  it('test button', async () => {
    await page.click(PO.testButton);

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'тест',
      'В навык пришло: тест',
    ]);
  });

  it('cors error', async () => {
    skillServer.setHandler(() => {
      // no cors header
      return '';
    });

    await user.enter();
    assert.equal(user.response.text, 'TypeError: Failed to fetch');
    assert.equal(user.response.tts, 'Ошибка');

    await user.say('Привет');
    assert.equal(user.response.text, 'TypeError: Failed to fetch');
    assert.equal(user.response.tts, 'Ошибка');

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'TypeError: Failed to fetch',
      'Привет',
      'TypeError: Failed to fetch',
    ]);
  });

  it('dont respond to other userId, show instruction', async () => {
    const user = new User();
    await user.enter();
    assert.include(user.response.text, 'Здесь вы можете отлаживать ваши навыки');
    assert.include(user.response.text, 'https://alice-dev.vitalets.xyz');
    assert.include(user.response.tts, 'Здесь вы можете отлаживать ваши навыки');
  });

});
