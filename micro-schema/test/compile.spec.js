describe('compile', () => {

  it('lazy compile schema', async () => {
    const schema = {
      prop: {
        $type: 'number',
      }
    };
    validate(schema, {});
    assert.ok(schema.$compiled);
  });

  it('unknown validator', async () => {
    const schema = {
      prop: {
        $foo: 'bar',
      }
    };
    assert.throws(() => validate(schema, {}), /Unknown validator: \$foo/);
  });
});
