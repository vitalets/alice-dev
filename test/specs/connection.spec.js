describe('connection', () => {

  it('terminate by server', async () => {
    await pageHelper.reloadPage();
    const client = getConnectedClient();
    client.close();
    await pageHelper.waitConnectionBarText('Нет подключения к серверу');
  });

  it.skip('re-connect by button', async () => {
    // todo
  });

  function getConnectedClient() {
    const clients = Array.from(webhookServer.wsClients._clients.keys());
    if (!clients.length) {
      throw new Error(`No connected ws clients on server`);
    }
    return clients[0];
  }

});
