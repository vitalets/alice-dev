describe('auth', () => {

  it('no auth', async () => {
    await pageHelper.reloadPage();
    const text = await pageHelper.getConnectionBarText();
    assert.include(text, 'Запустите навык Инструменты разработчика и скажите код');
  });

  it('has auth', async () => {
    await pageHelper.reloadPageForUserId('123');
    const text = await pageHelper.getConnectionBarText();
    assert.include(text, 'Используйте навык Инструменты разработчика на устройстве: My Device');
  });

  it('get auth by code (first device)', async () => {
    await pageHelper.reloadPage();
    const code = await extractCode();
    const user = new User();
    await user.enter();

    await user.say(code, body => body.request.nlu.entities = toYandexNumbers(code));
    await page.waitFor(100);

    const text = await pageHelper.getConnectionBarText();
    assert.include(text, 'Используйте навык Инструменты разработчика на устройстве: ru.yandex.searchplugin');
    assert.include(user.response.text, 'Код принят');

    await user.say('привет');
    assert.include(user.response.text, 'Добро пожаловать в навык!');
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
