describe('connection', () => {

  it('terminate by server', async () => {
    await pageHelper.reloadPage();
    const client = getConnectedClient();
    client.close();
    await pageHelper.waitConnectionBarText('Нет подключения к серверу');
  });

  it('re-connect by button', async () => {
    await pageHelper.reloadPage();
    const client = getConnectedClient();
    client.close();
    await pageHelper.waitConnectionBarText('Нет подключения к серверу');
    await page.click(PO.connectButton);
    await pageHelper.waitConnectionBarText('Подключено');
  });

  function getConnectedClient() {
    const clients = Array.from(webhookServer.wsClients._clients.keys());
    if (!clients.length) {
      throw new Error(`No connected ws clients on server`);
    }
    return clients[0];
  }

});
