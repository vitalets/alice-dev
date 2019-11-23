/**
 * Alice response validator.
 */

import { validate } from '@vitalets/micro-schema';
import noImageSchema from 'alice-protocol/response-no-image.json';

export function validateResponseBody(responseBody) {
  const errors = validate(noImageSchema, responseBody);
  return errors
    .map(error => validationMessages[error.validator](error))
    .join('\n');
}

const validationMessages = {
  $required: ({path}) => {
    return `Отсутствует обязательное поле "${path}"`;
  },
  $type: ({path, expectedType, actualType}) => {
    return `Неверный тип поля "${path}": "${actualType}" вместо "${expectedType}"`;
  },
  $maxLength: ({path, length, maxLength}) => {
    return `Превышена длина поля "${path}": ${length}, максимум ${maxLength}`;
  },
  $values: ({path, value, values}) => {
    return `Недопустимое значение поля "${path}": ${value}, вместо ${values.join(', ')}`;
  },
};
