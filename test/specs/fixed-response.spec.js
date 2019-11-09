describe('fixed-response', () => {

  it('respond to corresponding userId', async () => {
    const user = new User();
    await pageHelper.reloadPageForUserId(user.id);

    await user.enter();
    assert.equal(user.response.text, 'Ответ со страницы alice-dev: привет!');
    assert.equal(user.response.tts, 'Ответ со страницы элис-дев: привет!');

    await pageHelper.setInputValue(PO.fixedResponse.text, ' Нормально \n');
    await pageHelper.setInputValue(PO.fixedResponse.tts, 'Норм');

    await user.say('Как дела?');
    assert.equal(user.response.text, 'Нормально');
    assert.equal(user.response.tts, 'Норм');

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Ответ со страницы alice-dev: привет!',
      'Как дела?',
      'Нормально',
    ]);
  });

  it('test button', async () => {
    await pageHelper.reloadPage();

    await page.click(PO.proxyUrl.testButton);

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'тест',
      'Ответ со страницы alice-dev: привет!',
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

    await page.waitForSelector(PO.chat.messages`:last-child`.menuButton);
    await page.click(PO.chat.messages`:last-child`.menuButton);
    await page.click(PO.chatMenu.item`:first-child`);

    await user.say('Как дела?');
    assert.equal(user.response.text, 'Новая сессия');
    assert.equal(user.response.tts, 'Новая сессия');

    assert.equal(await page.$eval(PO.fixedResponse.radio, el => el.checked), true);
    assert.equal(await pageHelper.getElementText(PO.fixedResponse.text), 'Новая сессия');
    assert.equal(await pageHelper.getElementText(PO.fixedResponse.tts), 'Новая сессия');
    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Новая сессия',
      'Как дела?',
      'Новая сессия',
    ]);
  });

});
