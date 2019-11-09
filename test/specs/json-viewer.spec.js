describe('json-viewer', () => {

  it('view response', async () => {
    const user = new User();
    await pageHelper.reloadPageForUserId(user.id);

    await user.enter();

    await page.waitForSelector(PO.chat.messages`:last-child`.menuButton);
    await page.click(PO.chat.messages`:last-child`.menuButton);

    await page.waitForSelector(PO.chatMenu);
    await page.click(PO.chatMenu.item`:nth-child(2)`);

    await page.waitForSelector(PO.jsonPopup.title);
    assert.equal(await pageHelper.getElementText(PO.jsonPopup.title), 'JSON ответа');
  });

});
