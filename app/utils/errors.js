/**
 * Application-wide error codes and messages
 */

'use strict';

module.exports = {

  GENERIC_ERR: {
    internal: {
      code: 1001,
      httpCode: 500,
      httpResponse: 'Internal error'
    }
  },
  CUSTOM_ERR: {
    UserAlreadyPresent: {
      code: 1006,
      httpCode: 400,
      httpResponse: 'User with this email already exists'
    },
    ParameterMissing: {
      code: 1007,
      httpCode: 400,
      httpResponse: 'Email and password is required'
    }
  }
};

