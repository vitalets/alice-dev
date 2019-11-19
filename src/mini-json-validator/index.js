
const validate = (schema, value, path = []) => {
  const {keys, $keys} = schema.$compiled || compileSchema(schema);

  const errors = [];

  // validate value by $keys
  $keys
    .map($key => validators[$key](schema[$key], value, path))
    .forEach(error => errors.push(error));

  // validate all items for array
  if (schema.$type === 'array' && schema.$item && Array.isArray(value)) {
    value
      .map((item, index) => validate(schema.$item, item, path.concat([index])))
      .forEach(errorList => errors.push(...errorList));
  }

  // validate all sub objects
  if (value) {
    keys
      .map(key => validate(schema[key], value[key], path.concat([key])))
      .forEach(errorList => errors.push(...errorList));
  }

  return errors.filter(Boolean);
};

/**
 * Compile schema.
 *
 * @param {object} schema
 */
const compileSchema = schema => {
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

const validators = {
  $type: (type, value, path) => {
    if (value === undefined || value === null) {
      return;
    }

    if (type === 'array' && Array.isArray(value)) {
      return;
    }

    const valueType = typeof value;
    if (valueType !== type) {
      return {
        validator: '$type',
        path: path.join('.'),
        expectedType: type,
        actualType: valueType,
      };
    }
  },

  $required: (required, value, path) => {
    if (required && (value === undefined || value === null)) {
      return {
        validator: '$required',
        path: path.join('.'),
      };
    }
  },

  $maxLength: (maxLength, value, path) => {
    if (value && value.length > maxLength) {
      return {
        validator: '$maxLength',
        path: path.join('.'),
        length: value.length,
        maxLength,
      };
    }
  },

  $values: (values, value, path) => {
    if (value === undefined || value === null) {
      return;
    }

    if (!values.includes(value)) {
      return {
        validator: '$values',
        path: path.join('.'),
        values,
        value,
      };
    }
  },

  $item: () => {
    // $item is validated separately
  }
};

exports.validate = validate;
