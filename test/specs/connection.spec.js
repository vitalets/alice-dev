const fetch = require('node-fetch');

describe('connection', () => {

  it('terminate by server', async () => {
    await pageHelper.reloadPage();
    closeConnectedClient();
    await pageHelper.waitConnectionBarText('Нет подключения к серверу');
  });

  it('re-connect by button', async () => {
    await pageHelper.reloadPage();
    closeConnectedClient();
    await pageHelper.waitConnectionBarText('Нет подключения к серверу');
    await page.click(PO.connectionBar.connectButton);
    await pageHelper.waitConnectionBarText('Подключено');
  });

  it('show connections count on GET', async () => {
    await pageHelper.reloadPage();
    const response = await fetch(User.config.webhookUrl);
    assert.equal(await response.text(), 'Connected clients: 1');
  });

  it('disconnect clients with the same userId', async () => {
    await pageHelper.reloadPageForUserId('123');

    // open second tab
    const PageHelper = pageHelper.constructor;
    const page2 = await page.browser().newPage();
    await page2.goto(page.url());
    const pageHelper2 = new PageHelper(page2);
    await pageHelper2.waitConnectionBarText('Подключено');

    assert.include(await pageHelper.getConnectionBarText(), 'Нет подключения к серверу');

    await pageHelper.reloadPageForUserId('123');
    assert.include(await pageHelper2.getConnectionBarText(), 'Нет подключения к серверу');
  });

  function closeConnectedClient() {
    const clients = Array.from(webhookServer.wsClients._clients);
    if (!clients.length) {
      throw new Error(`No connected ws clients on server`);
    }
    return clients[0]._connection.close();
  }

});
