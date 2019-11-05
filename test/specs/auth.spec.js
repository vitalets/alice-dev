describe('auth', () => {

  it('no auth', async () => {
    await browserHelper.reloadPage();
    const text = await page.$eval(PO.connectionBar, el => el.textContent);
    assert.include(text, 'Запустите навык Инструменты разработчика и скажите код');
  });

  it('has auth', async () => {
    await browserHelper.reloadPage({
      devices: [{userId: '123', deviceName: 'My Device'}]
    });
    const text = await page.$eval(PO.connectionBar, el => el.textContent);
    assert.include(text, 'Запустите навык Инструменты разработчика на устройстве: My Device');
  });

  it('get auth by code (first device)', async () => {
    await browserHelper.reloadPage();
    const text = await page.$eval(PO.connectionBar, el => el.textContent);
    const code = text.match(/код:([\d\s]+)/)[1];

    const user = new User();
    await user.enter();
    await user.say(code, body => body.request.nlu.entities = toYandexNumbers(code));

    await page.waitFor(100);
    const newText = await page.$eval(PO.connectionBar, el => el.textContent);
    assert.include(newText, 'Запустите навык Инструменты разработчика на устройстве: ru.yandex.searchplugin');
  });

  it('get auth by code (second device)');
});

function toYandexNumbers(str) {
  return str.split(/\s+/).filter(Boolean).map(value => {
    return {
      type: 'YANDEX.NUMBER',
      value
    };
  });
}
