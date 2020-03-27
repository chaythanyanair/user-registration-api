/**
 * Application-wide error codes and messages
 */

'use strict';

module.exports = {

  // Generic errors
  GENERIC_ERR: {
    internal: {
      code: 1001,
      httpCode: 500,
      httpResponse: 'Internal error'
    }
  },
  // Custom errors
  CUSTOM_ERR: {
    UserAlreadyPresent: {
      code: 1006,
      httpCode: 400,
      httpResponse: 'User with this email already exists'
    }
  }
};

