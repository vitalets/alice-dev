describe('fixed-response', () => {

  let user;

  before(async () => {
    user = new User();
    await browserHelper.reloadPage({
      devices: [{userId: user.id, name: 'foo'}]
    });
  });

  it('text contains default value', async () => {
    const text = await page.$eval(PO.fixedResponse.text, el => el.value);
    assert.equal(text, 'Здорово! Как дела?');
  });

  it('tts contains default value', async () => {
    const text = await page.$eval(PO.fixedResponse.tts, el => el.value);
    assert.equal(text, 'Здор+ово! Как дела?');
  });

  it('respond to own userId enter', async () => {
    await user.enter();
    assert.equal(user.response.text, 'Здорово! Как дела?');
    assert.equal(user.response.tts, 'Здор+ово! Как дела?');
  });

  it('respond to own userId say', async () => {
    await user.enter();
    await user.say('Привет');

    assert.equal(user.response.text, 'Здорово! Как дела?');
    assert.equal(user.response.tts, 'Здор+ово! Как дела?');
  });

  it('respond to own userId (changed text/tts)', async () => {
    await user.enter();

    await page.click(PO.fixedResponse.text, { clickCount: 3 });
    await page.type(PO.fixedResponse.text, 'Здравствуй');
    await page.click(PO.fixedResponse.tts, { clickCount: 3 });
    await page.type(PO.fixedResponse.tts, 'Хай');

    await user.say('Привет');
    assert.equal(user.response.text, 'Здравствуй');
    assert.equal(user.response.tts, 'Хай');
  });

  it('dont respond to other userId, show instruction', async () => {
    const user2 = new User();
    await user2.enter();
    assert.include(user2.response.text, 'Здесь вы можете отлаживать локальную версию вашего навыка');
    assert.equal(user2.response.tts, '');
  });

});
