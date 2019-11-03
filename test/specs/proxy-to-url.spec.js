describe('proxy-to-url', () => {

  let user;

  async function setProxyUrl(url) {
    await page.click(PO.proxyUrl.input, { clickCount: 3 });
    await page.type(PO.proxyUrl.input, url);
  }

  before(async () => {
    user = new User();
    await browserHelper.reloadPage({
      devices: [{userId: user.id, name: 'foo'}]
    });
    await page.click(PO.proxyUrl.radio);
    await setProxyUrl(skillServer.getUrl());
  });

  it('proxy for own userId enter', async () => {
    await user.enter();
    assert.equal(user.response.text, 'В навык пришло: ');
    assert.equal(user.response.tts, 'В навык пришло: ');
  });

  it('proxy for own userId say', async () => {
    await user.enter();
    await user.say('Привет');

    assert.equal(user.response.text, 'В навык пришло: Привет');
    assert.equal(user.response.tts, 'В навык пришло: Привет');
  });

  it.skip('cors error', async () => {
    skillServer.setHandler(() => {
      // no cors header
      return 'response';
    });
    await user.enter();

    assert.equal(user.response.text, 'В навык пришло: Привет');
    assert.equal(user.response.tts, 'В навык пришло: Привет');
  });

  it('dont respond to other userId, show instruction', async () => {
    const user2 = new User();
    await user2.enter();
    assert.include(user2.response.text, 'Здесь вы можете отлаживать локальную версию вашего навыка');
    assert.equal(user2.response.tts, '');
  });

});
