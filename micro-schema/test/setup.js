const assert = require('assert');
const {validate} = require('../src');

Object.assign(global, {
  assert,
  validate,
});
