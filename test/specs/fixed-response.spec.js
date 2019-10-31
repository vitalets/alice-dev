describe('fixed-response', () => {

  before(async () => {
    await page.reload();
    const el = await page.waitForSelector(PO.connectionBar);
    const text = await el.evaluate(el => el.innerText);
    assert.include(text, 'Подключено');
  });

  it('checked by default', async () => {
    const checked = await page.$eval(PO.fixedResponse.radio, el => el.checked);
    assert.equal(checked, true);
  });

  it('text contains default value', async () => {
    const text = await page.$eval(PO.fixedResponse.text, el => el.value);
    assert.equal(text, 'Здорово! Как дела?');
  });

  it('tts contains default value', async () => {
    const text = await page.$eval(PO.fixedResponse.tts, el => el.value);
    assert.equal(text, 'Здор+ово! Как дела?');
  });

  it.skip('respond to alice request', async () => {
    const user = new User();
    await user.enter();
    assert.include(user.response.text, 'Привет');
    assert.include(user.response.tts, 'Привет');
  });
});
