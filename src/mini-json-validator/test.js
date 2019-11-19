const schema = require('../frontend/controllers/response-schema');
const {validate} = require('./');

const obj = {
  response: {
    card: {}
  }
};

const errors = validate(schema[0], obj);

console.log(errors);
