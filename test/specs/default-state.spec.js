describe('default state', () => {

  before(async () => {
    await pageHelper.reloadPage();
  });

  it('proxy url has default value', async () => {
    const url = await pageHelper.getInputValue(PO.proxyUrl.input);
    assert.equal(url, 'http://localhost:3000');
  });

  it('text contains default value', async () => {
    const text = await pageHelper.getInputValue(PO.fixedResponse.text);
    assert.equal(text, 'Ответ со страницы alice-dev: привет!');
  });

  it('tts contains default value', async () => {
    const tts = await pageHelper.getInputValue(PO.fixedResponse.tts);
    assert.equal(tts, 'Ответ со страницы элис-дев: привет!');
  });

});
