describe('fixed-response', () => {

  it('respond to corresponding userId', async () => {
    const user = new User();
    await pageHelper.reloadPageForUserId(user.id);

    await user.enter();
    assert.equal(user.response.text, 'Ответ со страницы alice-dev: привет!');
    assert.equal(user.response.tts, 'Ответ со страницы элис-дев: привет!');
    assert.equal(user.response.end_session, false);

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

    await page.waitForSelector(PO.chat.lastMessage.menuButton);
    await page.click(PO.chat.lastMessage.menuButton);
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

  it('edit as json: change text', async () => {
    const user = new User();
    await pageHelper.reloadPageForUserId(user.id);

    // переключаемся в режим json
    await page.click(PO.fixedResponse.switch);
    await page.waitForSelector(PO.fixedResponse.editor);
    assert.include(await pageHelper.getElementText(PO.fixedResponse.editor),
      '"text": "Ответ со страницы alice'
    );

    // ставим курсор перед "Ответ со страницы"
    await page.keyboard.press('ArrowDown');
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('ArrowRight');
    }
    await page.keyboard.type('ку!');

    await user.enter();
    assert.equal(user.response.text, 'ку!Ответ со страницы alice-dev: привет!');
    assert.equal(user.response.tts, 'Ответ со страницы элис-дев: привет!');
    assert.equal(user.response.end_session, false);

    // переключаемся обратно на text/tts
    await page.click(PO.fixedResponse.switch);
    await page.waitForSelector(PO.fixedResponse.text);
    const text = await pageHelper.getInputValue(PO.fixedResponse.text);
    const tts = await pageHelper.getInputValue(PO.fixedResponse.tts);
    assert.equal(text, 'ку!Ответ со страницы alice-dev: привет!');
    assert.equal(tts, 'Ответ со страницы элис-дев: привет!');
  });

  it('edit as json: change field name', async () => {
    await pageHelper.reloadPage();

    // переключаемся в режим json
    await page.click(PO.fixedResponse.switch);
    await page.waitForSelector(PO.fixedResponse.editor);

    // ставим курсор перед "text"
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.type('_');

    // переключаемся обратно на text/tts
    await page.click(PO.fixedResponse.switch);
    await page.waitForSelector(PO.fixedResponse.text);
    assert.equal(await pageHelper.getInputValue(PO.fixedResponse.text), '');

    // переключаемся обратно на json
    await page.click(PO.fixedResponse.switch);
    assert.include(await pageHelper.getElementText(PO.fixedResponse.editor),
      '"_text": "Ответ со страницы alice'
    );
  });
});
