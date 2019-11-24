/**
 * Alice response validator.
 */

import { validate } from '@vitalets/micro-schema';
import noImageSchema from 'alice-protocol/response-no-image.json';
import bigImageSchema from 'alice-protocol/response-big-image';
import itemsListSchema from 'alice-protocol/response-items-list.json';

export function validateResponseBody(responseBody) {
  const schema = getSchema(responseBody);
  const errors = validate(schema, responseBody);
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

const getSchema = responseBody => {
  const cardType = responseBody.response && responseBody.response.card && responseBody.response.card.type;
  // todo: the only problem here - if cardType = 'blabla',
  // there is no validation message like values can be BigImage, ItemsList
  switch (cardType) {
    case 'BigImage': return bigImageSchema;
    case 'ItemsList': return itemsListSchema;
    default: return noImageSchema;
  }
};
