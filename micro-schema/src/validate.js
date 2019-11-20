/**
 * Micro-schema JSON validator
 */
const validators = require('./validators');
const compile = require('./compile');

module.exports = (schema, value, {allowUnknownKeys} = {}) => {
  // todo: handle unknown keys
  return validate(schema, value, []);
};

const validate = (schema, value, path = []) => {
  const {keys, $keys} = schema.$compiled || compile(schema);

  const errors = [];

  // validate value by $keys
  $keys.forEach($key => {
    const fn = validators[$key];
    const result = fn(schema[$key], value);
    errors.push(createError($key, path, result));
  });

  // validate all items for array
  if (schema.$type === 'array' && schema.$item && Array.isArray(value)) {
    value.forEach((item, index) => {
      const itemPath = path.concat([index]);
      const results = validate(schema.$item, item, itemPath);
      errors.push(...results);
    });
  }

  // validate all sub objects
  if (value) {
    keys.forEach(key => {
      const keyPath = path.concat([key]);
      const results = validate(schema[key], value[key], keyPath);
      errors.push(...results);
    });
  }

  return errors.filter(Boolean);
};

/**
 * Creates error object.
 *
 * @param {string} $key
 * @param {array} path
 * @param {object} result
 */
const createError = ($key, path, result) => {
  if (result) {
    return {
      validator: $key,
      path: path.join('.'),
      ...(typeof result === 'object' ? result : {}),
    };
  }
};
