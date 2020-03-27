'use strict';

const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'appiness',
  outputCapture: 'std',
});

module.exports = logger;
