describe('proxy', () => {

  it('proxy to existing client - show response', async () => {
    const user = new User();
    const wsClient = wsClientFactory.create(user.id);
    await wsClient.connect();
    await user.enter();
    assert.include(user.response.text, 'hello');
  });

  it('proxy to non-existing client - show instruction', async () => {
    const user = new User();
    await user.enter();
    assert.include(user.response.text, 'Здесь вы можете отлаживать навыки без публикации в каталоге');
  });

  it('proxy to disconnected client - show instruction', async () => {
    const user = new User();
    const wsClient = wsClientFactory.create(user.id);
    await wsClient.connect();
    await wsClient.close();
    await user.enter();
    assert.include(user.response.text, 'Здесь вы можете отлаживать навыки без публикации в каталоге');
  });

});
