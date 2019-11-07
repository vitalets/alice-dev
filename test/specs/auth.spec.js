describe('auth', () => {

  it('no connections, show instruction', async () => {
    const user = new User();
    await user.enter();
    assert.include(user.response.text, 'Здесь вы можете отлаживать ваши навыки');
    assert.include(user.response.text, 'alice-dev.vitalets.xyz');
    assert.include(user.response.tts, 'Здесь вы можете отлаживать ваши навыки');
  });

  it('no auth', async () => {
    await pageHelper.reloadPage();
    const text = await pageHelper.getConnectionBarText();
    assert.include(text, 'Запустите навык Инструменты разработчика и скажите код');
  });

  it('has auth', async () => {
    await pageHelper.reloadPageForUserId('123');
    const text = await pageHelper.getConnectionBarText();
    assert.include(text, 'Скажите что-нибудь в навык Инструменты разработчика на устройстве: My Device');
  });

  it('incorrect code', async () => {
    await pageHelper.reloadPage();
    const code = '12345';
    const user = new User();
    await user.enter();

    await user.say(code, body => body.request.nlu.entities = toYandexNumbers(code));
    await page.waitFor(100);

    const text = await pageHelper.getConnectionBarText();
    assert.include(text, 'Запустите навык Инструменты разработчика и скажите код');
    assert.include(user.response.text, 'Неверный или устаревший код');
  });

  it('auth by code (first device)', async () => {
    await pageHelper.reloadPage();
    const code = await extractCode();
    const user = new User();
    await user.enter();

    await user.say(code, body => body.request.nlu.entities = toYandexNumbers(code));
    await page.waitFor(100);

    const text = await pageHelper.getConnectionBarText();
    assert.include(text, 'Скажите что-нибудь в навык Инструменты разработчика на устройстве: ru.yandex.searchplugin');
    assert.include(user.response.text, 'Код принят');

    await user.say('привет');
    assert.include(user.response.text, 'Ответ со страницы alice-dev: привет!');
    assert.include(user.response.tts, 'Ответ со страницы элис-дев: привет!');

    // clear code after auth
    const user2 = new User();
    await user2.enter();
    await user2.say(code, body => body.request.nlu.entities = toYandexNumbers(code));
    assert.include(user2.response.text, 'Неверный или устаревший код');
  });

  it('get auth by code (second device)');
});

async function extractCode() {
  const text = await page.$eval(PO.connectionBar, el => el.textContent);
  return text.match(/код:([\d\s]+)/)[1];
}

function toYandexNumbers(str) {
  return str.split(/\s+/).filter(Boolean).map(value => {
    return {
      type: 'YANDEX.NUMBER',
      value
    };
  });
}
