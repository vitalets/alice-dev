describe('mode', () => {

  before(async () => {
    await browserHelper.reloadPage();
  });

  const assertChecked = async (selector, isChecked) => {
    const checked = await page.$eval(selector, el => el.checked);
    assert.equal(checked, isChecked, `${selector} checked should be ${isChecked}`);
  };

  it('change mode', async () => {
    await assertChecked(PO.proxyUrl.radio, false);
    await assertChecked(PO.fixedResponse.radio, true);

    await page.click(PO.proxyUrl.radio);
    await assertChecked(PO.proxyUrl.radio, true);
    await assertChecked(PO.fixedResponse.radio, false);

    await page.click(PO.fixedResponse.radio);
    await assertChecked(PO.proxyUrl.radio, false);
    await assertChecked(PO.fixedResponse.radio, true);
  });

});
