describe('json-viewer', () => {

  it('view response', async () => {
    const user = new User();
    await pageHelper.reloadPageForUserId(user.id);

    await user.enter();

    await page.waitForSelector(PO.chat.lastMessageMenuButton);
    await page.click(PO.chat.lastMessageMenuButton);

    await page.waitForSelector(PO.chat.messageMenu.secondChild);
    await page.click(PO.chat.messageMenu.secondChild);

    await page.waitForSelector(PO.jsonPopup.title);
    assert.equal(await pageHelper.getElementText(PO.jsonPopup.title), 'JSON ответа');
  });

});
