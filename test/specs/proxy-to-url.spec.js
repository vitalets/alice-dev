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
    assert.equal(user.response.text, 'Добро пожаловать');
    assert.equal(user.response.tts, 'Добро пожаловать');
    assert.equal(user.response.end_session, false);

    await user.say('Привет');
    assert.equal(user.response.text, 'Навык получил команду: привет');
    assert.equal(user.response.tts, 'Навык получил команду: привет');
    assert.equal(user.response.end_session, false);

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'запусти навык тест',
      'Добро пожаловать',
      'привет',
      'Навык получил команду: привет'
    ]);
  });

  it('test button', async () => {
    await page.click(PO.proxyUrl.testButton);
    await pageHelper.waitChatMessagesCount(2);
    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Запусти навык тест',
      'Добро пожаловать',
    ]);

    await page.click(PO.proxyUrl.testButton);
    await pageHelper.waitChatMessagesCount(4);

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'Запусти навык тест',
      'Добро пожаловать',
      'тест',
      'Навык получил команду: тест'
    ]);
  });

  it('cors error', async () => {
    skillServer.setHandler((req, res) => {
      res.removeHeader('Access-Control-Allow-Origin');
      return 'running';
    });

    await user.enter();
    assert.equal(user.response.text,
      `Error: Прокси URL не ответил. Проверьте, что навык запущен на ${skillServer.getUrl()} и возвращает заголовок Access-Control-Allow-Origin.`
    );
    assert.equal(user.response.tts, 'Ошибка');

    await user.say('Привет');

    assert.equal(user.response.text,
      `Error: Прокси URL не ответил. Проверьте, что навык запущен на ${skillServer.getUrl()} и возвращает заголовок Access-Control-Allow-Origin.`
    );
    assert.equal(user.response.tts, 'Ошибка');
    assert.equal(
      Boolean(await page.$(PO.chat.lastAliceMessageMenuButton)),
      false,
      'No chat menu for error messages'
    );

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'запусти навык тест',
      `Error: Прокси URL не ответил. Проверьте, что навык запущен на ${skillServer.getUrl()} и возвращает заголовок Access-Control-Allow-Origin.`,
      'привет',
      `Error: Прокси URL не ответил. Проверьте, что навык запущен на ${skillServer.getUrl()} и возвращает заголовок Access-Control-Allow-Origin.`,
    ]);
  });

  it('timeout', async () => {
    skillServer.setHandler(async () => {
      await Timeout.set(3000);
      return 'running';
    });

    await user.enter();
    await pageHelper.waitChatMessagesCount(2);

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'запусти навык тест',
      'Error: Proxy URL не ответил за 2000 мс',
    ]);
    assert.include(user.response.text, 'Proxy URL не ответил за 2000 мс');
    assert.include(user.response.tts, 'Ошибка');
  });

  it('404', async () => {
    skillServer.setHandler(async (req, res) => {
      res.writeHead(404);
      res.end();
    });

    await user.enter();
    await pageHelper.waitChatMessagesCount(2);

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'запусти навык тест',
      'Error: Proxy URL: 404 Not Found',
    ]);
    assert.include(user.response.text, 'Error: Proxy URL: 404 Not Found');
    assert.include(user.response.tts, 'Ошибка');
  });
});
