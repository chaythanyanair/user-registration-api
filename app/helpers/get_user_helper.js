'use strict';

const pgPool = require('../config/data_source');
const logger = require('../utils/logger');
const { Fields, Tables } = require('../utils/constants');
const errors = require('../utils/errors');

class GetUserHelper {
  constructor() {}

  _formatResult(users) {
    if (users.length <= 0) {
      return {
        code: 200,
        status: 'Success',
        message: 'No user found'
      };
    }
    const user = users[0];
    const userData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      roles: user.roles ? user.roles.split(',') : []
    };

    return {
      code: 200,
      status: 'Success',
      user: userData
    };
  }

  async getUserFromDb(userId) {
    logger.info('getUserFromDb ', userId);
    await pgPool.initializeDb();
    this.dbClient = pgPool.dbClient;
    let result;
    const fields = [
      Fields.FIRST_NAME,
      Fields.PASSWORD,
      Fields.ID,
      Fields.EMAIL,
      Fields.LAST_NAME
    ];
    const query =
      `select ${fields}, array_to_string(array_agg(${Fields.ROLE}) , ',') as ` +
      `${Fields.ROLES} from ${Tables.USER} inner join ${Tables.USER_ROLE} on ` +
      `(${Fields.ID}=${Fields.USER_ROLE_ID}) where ${Fields.ID}=${userId} ` +
      `group by ${fields}`;
    try {
      result = await this.dbClient.query(query);
    } catch (error) {
      logger.error('ERROR fetching user details', error);
      return {
        error: errors.GENERIC_ERR.internal,
        data: null
      };
    } finally {
      this.dbClient.release();
    }

    return {
      error: null,
      data: this._formatResult(result.rows)
    };
  }
}

module.exports = new GetUserHelper();
