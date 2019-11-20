/**
 * Compile schema.
 */
const validators = require('./validators');

/**
 * @param {object} schema
 */
module.exports = schema => {
  const keys = Object.keys(schema).filter(key => !is$key(key));

  if (!schema.$type && keys.length > 0) {
    schema.$type = 'object';
  }

  // handle sub-schema as primitive
  keys.forEach(key => {
    const value = schema[key];
    if (value && typeof value !== 'object') {
      schema[key] = {
        $type: typeof value,
        $required: true,
        $values: [value]
      };
    }
  });

  // handle sub-schema as array
  keys.forEach(key => {
    const value = schema[key];
    if (Array.isArray(value)) {
      schema[key] = {
        $type: 'array',
        $item: value[0]
      };
    }
  });

  const $keys = Object.keys(schema).filter(key => is$key(key));

  // check $keys
  $keys.forEach($key => {
    if (!validators[$key]) {
      throw new Error(`Unknown validator: ${$key}`);
    }
  });

  return schema.$compiled = {keys, $keys};
};

const is$key = key => key.startsWith('$');
