describe('connection', () => {

  it('connect to ws on start', async () => {
    await page.reload();
    const el = await page.waitForSelector(PO.connectionBar);
    const text = await el.evaluate(el => el.innerText);
    assert.include(text, 'Подключено');
  });

  // todo: implement disconnection on server
  it.skip('disconnect by server', async () => {
    await page.reload();
    const el = await page.waitForSelector(PO.connectionBar);
    const text = await el.evaluate(el => el.innerText);
    assert.include(text, 'Подключено');
  });

});
