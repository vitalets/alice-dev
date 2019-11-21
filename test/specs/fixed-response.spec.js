describe('fixed-response', () => {

  it('respond to corresponding userId', async () => {
    const user = new User();
    await pageHelper.reloadPageForUserId(user.id);

    await user.enter();
    assert.equal(user.response.text, 'Ответ со страницы alice-dev: привет!');
    assert.equal(user.response.tts, 'Ответ со страницы элис-дев: привет!');

    await pageHelper.setInputValue(PO.fixedResponse.text, ' Все\nнормально \n');
    await pageHelper.setInputValue(PO.fixedResponse.tts, 'Норм');

    await user.say('Как дела?');
    // keep original formatting (trailing spaces) - to see raw in JSON
    assert.equal(user.response.text, ' Все\nнормально \n');
    assert.equal(user.response.tts, 'Норм');

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'запусти навык тест',
      'Ответ со страницы alice-dev: привет!',
      'как дела',
      'Все\nнормально', // в чате строка тримится
    ]);
  });

  it('test button', async () => {
    await pageHelper.reloadPage();

    await page.click(PO.proxyUrl.testButton);
    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Запусти навык тест',
      'Ответ со страницы alice-dev: привет!',
    ]);

    await page.click(PO.proxyUrl.testButton);
    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Запусти навык тест',
      'Ответ со страницы alice-dev: привет!',
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
    assert.equal(user.response.text, 'Добро пожаловать');
    assert.equal(user.response.tts, 'Добро пожаловать');
    assert.equal(user.response.end_session, false);

    await page.waitForSelector(PO.chat.messages`:last-child`.menuButton);
    await page.click(PO.chat.messages`:last-child`.menuButton);
    await page.click(PO.chatMenu.item`:first-child`);

    await user.say('Как дела?');
    assert.equal(user.response.text, 'Добро пожаловать');
    assert.equal(user.response.tts, 'Добро пожаловать');
    assert.equal(user.response.end_session, false);

    assert.equal(await page.$eval(PO.fixedResponse.radio, el => el.checked), true);
    assert.equal(await pageHelper.getElementText(PO.fixedResponse.text), 'Добро пожаловать');
    assert.equal(await pageHelper.getElementText(PO.fixedResponse.tts), 'Добро пожаловать');
    assert.deepEqual(await pageHelper.getChatMessages(), [
      'запусти навык тест',
      'Добро пожаловать',
      'как дела',
      'Добро пожаловать',
    ]);
  });

});
