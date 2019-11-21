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

    await user.say(code);
    await page.waitFor(100);

    const text = await pageHelper.getConnectionBarText();
    assert.include(text, 'Запустите навык Инструменты разработчика и скажите код');
    assert.include(user.response.text, 'Неверный или устаревший код');
  });

  it('auth device by code', async () => {
    await pageHelper.reloadPage();
    const code = await extractCode();
    const user = new User(null, body => body.meta.client_id = 'device1');
    await user.enter();

    await user.say(code);
    const barText = await pageHelper.waitConnectionBarText('Скажите что-нибудь');
    assert.include(barText,
      'Скажите что-нибудь в навык Инструменты разработчика на устройстве: device1'
    );
    assert.include(user.response.text, 'Код принят');

    await user.say('привет');
    assert.include(user.response.text, 'Ответ со страницы alice-dev: привет!');
    assert.include(user.response.tts, 'Ответ со страницы элис-дев: привет!');

    // can not re-use code after auth
    const user2 = new User();
    await user2.enter();
    await user2.say(code);
    assert.include(user2.response.text, 'Неверный или устаревший код');
  });

  it('change device', async () => {
    await pageHelper.reloadPage();
    let code = await extractCode();
    let user1 = new User(null, body => body.meta.client_id = 'device1');
    await user1.enter();

    await user1.say(code);
    let barText = await pageHelper.waitConnectionBarText('Скажите что-нибудь');
    assert.include(barText, 'на устройстве: device1');

    await page.click(PO.connectionBar.changeDeviceButton);
    await pageHelper.waitConnectionBarText('скажите код');
    code = await extractCode();
    let user2 = new User(null, body => body.meta.client_id = 'device2');
    await user2.enter();

    await user2.say(code);
    barText = await pageHelper.waitConnectionBarText('Скажите что-нибудь');
    assert.include(barText, 'на устройстве: device2');

    await user2.say('привет');
    assert.include(user2.response.text, 'Ответ со страницы alice-dev: привет!');

    await user1.say('привет');
    assert.include(user1.response.text, 'Здесь вы можете отлаживать ваши навыки без публикации');
  });

});

async function extractCode() {
  const text = await page.$eval(PO.connectionBar, el => el.textContent);
  return text.match(/код:([\d\s]+)/)[1];
}
