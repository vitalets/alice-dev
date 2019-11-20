describe('$item', () => {

  it('explicit $item', async () => {
    const schema = {
      prop: {
        $type: 'array',
        $item: {
          $type: 'number'
        }
      }
    };
    assert.deepStrictEqual(validate(schema, {prop: []}), []);
    assert.deepStrictEqual(validate(schema, {prop: [1, 2]}), []);
    assert.deepStrictEqual(validate(schema, {prop: [1, '2']}), [
      {
        validator: '$type',
        path: 'prop.1',
        expectedType: 'number',
        actualType: 'string',
      }
    ]);
  });

  it('implicit $item', async () => {
    const schema = {
      prop: [
        {$type: 'number'}
      ]
    };
    assert.deepStrictEqual(validate(schema, {prop: []}), []);
    assert.deepStrictEqual(validate(schema, {prop: [1, 2]}), []);
    assert.deepStrictEqual(validate(schema, {prop: [1, '2']}), [
      {
        validator: '$type',
        path: 'prop.1',
        expectedType: 'number',
        actualType: 'string',
      }
    ]);
  });
});
