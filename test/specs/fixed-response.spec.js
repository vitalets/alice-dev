describe('fixed-response', () => {

  let user;

  const setText = async text => {
    await page.click(PO.fixedResponse.text, { clickCount: 3 });
    await page.type(PO.fixedResponse.text, text);
  };

  const setTts = async tts => {
    await page.click(PO.fixedResponse.tts, { clickCount: 3 });
    await page.type(PO.fixedResponse.tts, tts);
  };

  before(async () => {
    user = new User();
    await browserHelper.reloadPageForUserId(user.id);
  });

  it('respond to corresponding userId', async () => {
    await user.enter();
    assert.equal(user.response.text, 'Добро пожаловать в навык!');
    assert.equal(user.response.tts, 'Добро пожаловать в н+авык!');

    await setText('Нормально');
    await setTts('Норм');

    await user.say('Как дела?');
    assert.equal(user.response.text, 'Нормально');
    assert.equal(user.response.tts, 'Норм');

    const chatMessages = await page.$$eval(PO.chat.messages, elems => elems.map(el => el.textContent));
    assert.deepEqual(chatMessages, [
      'Добро пожаловать в навык!',
      'Как дела?',
      'Нормально',
    ]);
  });

  it('dont respond to other userId, show instruction', async () => {
    const user2 = new User();
    await user2.enter();
    assert.include(user2.response.text, 'Здесь вы можете отлаживать локальную версию вашего навыка');
    assert.equal(user2.response.tts, '');
  });

});
