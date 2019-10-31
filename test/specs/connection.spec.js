describe('connection', () => {

  it('connect to ws on start', async () => {
    await page.reload();
    const el = await page.waitForSelector(PO.connectionBar);
    const text = await el.evaluate(el => el.innerText);
    assert.include(text, 'Подключено');
  });

  it.skip('terminate by server', async () => {
    // todo: implement termination on server
  });

});
