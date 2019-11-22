describe('json-viewer', () => {

  it('view request', async () => {
    const user = new User();
    await pageHelper.reloadPageForUserId(user.id);

    await user.enter();
    await user.say('Привет');

    await page.click(PO.chat.messages`:nth-last-child(2)`.menuButton);
    await page.waitForSelector(PO.chatMenu);
    await page.click(PO.chatMenu.item`:first-child`);

    await page.waitForSelector(PO.jsonPopup.title);
    assert.equal(await pageHelper.getElementText(PO.jsonPopup.title), 'JSON запроса');
    await page.waitForSelector(PO.jsonPopup.content);
    assert.include(await pageHelper.getElementText(PO.jsonPopup.content),
      'object{4}request{4}command:приветoriginal_utterance:Приветtype:SimpleUtterance'
    );

    // close popup
    await page.click(PO.jsonPopup.title.closeButton);
    await page.waitForSelector(PO.jsonPopup.title, {hidden: true});
  });

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
    await page.waitForSelector(PO.jsonPopup.content);
    assert.include(await pageHelper.getElementText(PO.jsonPopup.content),
      'object{3}response{3}text:Ответ со страницы alice-dev: привет!tts:Ответ со страницы элис-дев: привет!'
    );

    // close popup
    await page.click(PO.jsonPopup.title.closeButton);
    await page.waitForSelector(PO.jsonPopup.title, {hidden: true});
  });

});
