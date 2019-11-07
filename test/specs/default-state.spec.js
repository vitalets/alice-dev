describe('default state', () => {

  before(async () => {
    await pageHelper.reloadPage();
  });

  it('proxy url has default value', async () => {
    const url = await page.$eval(PO.proxyUrl.input, el => el.value);
    assert.equal(url, 'http://localhost:3000');
  });

  it('text contains default value', async () => {
    const text = await page.$eval(PO.fixedResponse.text, el => el.value);
    assert.equal(text, 'Ответ со страницы alice-dev');
  });

  it('tts contains default value', async () => {
    const tts = await page.$eval(PO.fixedResponse.tts, el => el.value);
    assert.equal(tts, 'Ответ со страницы элис-дев');
  });

});
