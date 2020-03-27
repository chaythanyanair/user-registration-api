/**
 * Route configuration
 */

'use strict';

const userRouter = require('./user_router');

module.exports = function (app) {
  app.use('/user', userRouter);
};
