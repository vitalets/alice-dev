describe('connection', () => {

  it('connect to ws on start', async () => {
    await browserHelper.reloadPage();
    const text = await page.$eval(PO.connectionBar, el => el.innerText);
    assert.include(text, 'Подключено');
  });

  it.skip('terminate by server', async () => {
    // todo: implement termination on server
  });

});
