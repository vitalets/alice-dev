describe('fixed-response', () => {

  it('respond to corresponding userId', async () => {
    const user = new User();
    await pageHelper.reloadPageForUserId(user.id);

    await user.enter();
    assert.equal(user.response.text, 'Добро пожаловать в навык!');
    assert.equal(user.response.tts, 'Добро пожаловать в н+авык!');

    await pageHelper.setInputValue(PO.fixedResponse.text, 'Нормально');
    await pageHelper.setInputValue(PO.fixedResponse.tts, 'Норм');

    await user.say('Как дела?');
    assert.equal(user.response.text, 'Нормально');
    assert.equal(user.response.tts, 'Норм');

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Добро пожаловать в навык!',
      'Как дела?',
      'Нормально',
    ]);
  });

  it('test button', async () => {
    await pageHelper.reloadPage();

    await page.click(PO.testButton);

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'тест',
      'Добро пожаловать в навык!',
    ]);
  });

  it('fix response from chat', async () => {
    const user = new User();
    await pageHelper.reloadPageForUserId(user.id);

    await page.click(PO.proxyUrl.radio);
    await pageHelper.setInputValue(PO.proxyUrl.input, skillServer.getUrl());

    await user.enter();
    assert.equal(user.response.text, 'Новая сессия');
    assert.equal(user.response.tts, 'Новая сессия');

    await page.waitForSelector(PO.chat.messageMenu.button);
    await page.click(PO.chat.messageMenu.button);
    await page.click(PO.chat.messageMenu.firstItem);

    await user.say('Как дела?');
    assert.equal(user.response.text, 'Новая сессия');
    assert.equal(user.response.tts, 'Новая сессия');

    assert.equal(await page.$eval(PO.fixedResponse.radio, el => el.checked), true);
    assert.equal(await page.$eval(PO.fixedResponse.text, el => el.textContent), 'Новая сессия');
    assert.equal(await page.$eval(PO.fixedResponse.tts, el => el.textContent), 'Новая сессия');
    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Новая сессия',
      'Как дела?',
      'Новая сессия',
    ]);
  });

  it('dont respond to other userId, show instruction', async () => {
    const user2 = new User();
    await user2.enter();
    assert.include(user2.response.text, 'Здесь вы можете отлаживать ваши навыки');
    assert.equal(user2.response.tts, '');
  });

});
