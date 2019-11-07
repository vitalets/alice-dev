const Timeout = require('await-timeout');

describe('proxy-to-url', () => {

  let user;

  beforeEach(async () => {
    user = new User();
    await pageHelper.reloadPageForUserId(user.id);
    await page.click(PO.proxyUrl.radio);
    await pageHelper.setInputValue(PO.proxyUrl.input, skillServer.getUrl());
  });

  afterEach(async () => {
    skillServer.resetHandler();
  });

  it('proxy for corresponding userId', async () => {
    await user.enter();
    assert.equal(user.response.text, 'Новая сессия');
    assert.equal(user.response.tts, 'Новая сессия');

    await user.say('Привет');
    assert.equal(user.response.text, 'В навык пришло: Привет');
    assert.equal(user.response.tts, 'В навык пришло: Привет');

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Новая сессия',
      'Привет',
      'В навык пришло: Привет'
    ]);
  });

  it('test button', async () => {
    await page.click(PO.testButton);
    await pageHelper.waitLastChatMessage('В навык пришло: тест');

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'тест',
      'В навык пришло: тест',
    ]);
  });

  it('cors error', async () => {
    // no cors header in handler
    skillServer.setHandler(() => 'running');

    await user.enter();
    assert.equal(user.response.text, 'Error: Failed to fetch');
    assert.equal(user.response.tts, 'Ошибка');

    await user.say('Привет');

    assert.equal(user.response.text, 'Error: Failed to fetch');
    assert.equal(user.response.tts, 'Ошибка');
    assert.equal(
      Boolean(await page.$(PO.chat.lastAliceMessageMenuButton)),
      false,
      'No chat menu for error messages'
    );

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Error: Failed to fetch',
      'Привет',
      'Error: Failed to fetch',
    ]);
  });

  it('timeout', async () => {
    skillServer.setHandler(async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      await Timeout.set(3000);
      return 'running';
    });

    await user.say('Привет');

    await pageHelper.waitLastChatMessage('Error: Proxy URL не ответил за 2000 мс');
    assert.include(user.response.text, 'Proxy URL не ответил за 2000 мс');
    assert.include(user.response.tts, 'Ошибка');
  });

  it('404', async () => {
    skillServer.setHandler(async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.writeHead(404);
      res.end();
    });

    await user.say('Привет');

    await pageHelper.waitLastChatMessage('Error: Proxy URL: 404 Not Found');
    assert.include(user.response.text, 'Error: Proxy URL: 404 Not Found');
    assert.include(user.response.tts, 'Ошибка');
  });
});
