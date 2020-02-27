describe('chat', () => {

  let user;

  beforeEach(async () => {
    user = new User();
    await pageHelper.reloadPageForUserId(user.id);
    await page.click(PO.proxyUrl.radio);
    await pageHelper.setInputValue(PO.proxyUrl.input, skillServer.getUrl());
  });

  afterEach(async () => {
    skillServer.resetHandler();
  });

  it('show ButtonPressed with payload', async () => {
    skillServer.setHandler(req => {
      const { session, version } = req.body;
      const response = {
        text: 'привет',
        buttons: [
          { title: 'кнопка', payload: { foo: 42 } }
        ],
        end_session: false,
      };
      return { response, session, version };
    });
    await user.enter();
    await user.tap('кнопка');

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'запусти навык тест',
      'привет',
      'ButtonPressed {"foo":42}',
      'привет'
    ]);
  });

  it('show bigImage ButtonPressed with payload', async () => {
    skillServer.setHandler(req => {
      const {session, version} = req.body;
      const response = {
        text: 'привет',
        tts: 'привет',
        end_session: false,
        card: {
          type: 'BigImage',
          image_id: '123',
          title: 'картинка',
          button: {
            payload: {
              foo: 42
            }
          }
        }
      };
      return {response, session, version};
    });
    await user.enter();
    await user.tapImage();

    assert.deepEqual(await pageHelper.getChatMessages(), [
      'запусти навык тест',
      'привет',
      'ButtonPressed {"foo":42}',
      'привет'
    ]);
  });

});
