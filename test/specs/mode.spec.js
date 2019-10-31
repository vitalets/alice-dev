describe('mode', () => {

  before(async () => {
    await page.reload();
    const el = await page.waitForSelector(PO.connectionBar);
    const text = await el.evaluate(el => el.innerText);
    assert.include(text, 'Подключено');
  });

  const assertChecked = async (selector, isChecked) => {
    const checked = await page.$eval(selector, el => el.checked);
    assert.equal(checked, isChecked);
  };

  it('fixedResponse checked by default', async () => {
    await assertChecked(PO.proxyUrl.radio, false);
    await assertChecked(PO.fixedResponse.radio, true);
  });

  it('change to proxyUrl', async () => {
    await page.click(PO.proxyUrl.radio);
    await assertChecked(PO.proxyUrl.radio, true);
    await assertChecked(PO.fixedResponse.radio, false);
  });

  it('change to fixedResponse', async () => {
    await page.click(PO.proxyUrl.radio);
    await page.click(PO.fixedResponse.radio);
    await assertChecked(PO.proxyUrl.radio, false);
    await assertChecked(PO.fixedResponse.radio, true);
  });

});
