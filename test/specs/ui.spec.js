describe('ui', () => {

  it('connect to ws endpoint', async () => {
    await page.reload();
    await page.waitForSelector('#client-snackbar');
    const text = await page.$eval('#client-snackbar', el => el.innerText);
    assert.equal(text, 'Подключение...');
  });

});
