describe('proxy', () => {

  it.skip('should work', async () => {
    const user = new User();
    await user.enter();
    assert.equal(user.response.text, '');
  });

});
