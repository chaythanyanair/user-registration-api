'use strict';
const pgPool = require('../config/data_source');
const logger = require('../utils/logger');
const utils = require('../utils/utils');
const {Roles, Fields, Tables} = require('../utils/constants');
const errors = require('../utils/errors')

class PostUserHelper {
  constructor() {
   }

  _formatResult(userData) {
      const user = {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        roles: userData.roles,
      };

    return {
      code: 200,
      status: 'Success',
      user: user
    };
  }

  async _addUserToUserTable(user) {
    const userObject = {
      [Fields.EMAIL]: user.email,
      [Fields.PASSWORD]:
        await utils.getEncryptedPassword(user.password),
      [Fields.FIRST_NAME]: user.first_name,
      [Fields.LAST_NAME]: user.last_name
    };
    const query = {
      sql: `INSERT INTO ${Tables.USER} (${Object.keys(userObject).join(',')})` + 
        ` VALUES($1,$2, $3, $4) RETURNING ID`,
      values: Object.values(userObject)
    };
    const result = await this.dbClient.query(query.sql, query.values);
    return result;
  }

  async _userExists(email) {
      let query = `SELECT * FROM ${Tables.USER}` +
        ` WHERE ${Fields.EMAIL} = $1`;

      const result = await this.dbClient.query(query, [email]);
      if (result.rows.length >=1) {
        return true;
      }
      return false;
  }

  async postUserToDb(user) {
    logger.info('PostUserToDb ');
    await pgPool.initializeDb();
    this.dbClient = pgPool.dbClient;
    try {
      await this.dbClient.query('BEGIN');
      const exists = await this._userExists(user.email);
      if (exists) {
        return {
          error: errors.CUSTOM_ERR.UserAlreadyPresent,
          data: null
        };
      }
      const result = await this._addUserToUserTable(user);
      user.id = parseInt(result.rows[0].id);
      if (user.id == 1) {
        user.roles = [Roles.ADMIN, Roles.EDITOR, Roles.OBSERVER]
      }
      if (!user.roles) {
        user.roles = [Roles.OBSERVER]
      }
      await this._insertRoles(user);
      await this.dbClient.query('COMMIT');

    } catch (e) {
      logger.error(e);
      await this.dbClient.query('ROLLBACK');
      return {
        error: errors.GENERIC_ERR.internal,
        data: null
      }
    } finally {
      this.dbClient.release();
    }
    return {
      error: null,
      data: this._formatResult(user)
    }
  }

  _getPlaceHolders(offset=0, length) {
    const placeHolder=[];
    for (let i=offset; i< offset+length; i++) {
      placeHolder.push(`$${i+1}`);
    }
    return placeHolder.join(',');
  }

  async _insertRoles( user) {
    const fields = [Fields.USER_ROLE_ID, Fields.ROLE,
      Fields.CREATED_BY,  Fields.UPDATED_BY];
    const setObj = user.set || user;
    if (Fields.CREATED_AT in user) {
      fields.push(Fields.CREATED_AT);
    }
    const placeHolders =[];
    
    const insertValues = setObj[Fields.ROLES].map((role) => {
      const value = [user[Fields.ID], role, user[Fields.CREATED_BY] || 1,
        user[Fields.UPDATED_BY] || 1];

      if (Fields.CREATED_AT in user) {
        value.push(user[Fields.CREATED_AT]);
      }
      const placeHolderString = this._getPlaceHolders(
        placeHolders.length * value.length, value.length);
      placeHolders.push(`(${placeHolderString})`);
      return value;
    });

    const insertQuery = `INSERT INTO ${Tables.USER_ROLE} (${fields.join(',')})
      VALUES ${placeHolders.join(',')}`;
    const  insertQueryValues =
      insertValues.reduce((acc, val) => acc.concat(val), []);
    return await this.dbClient.query(insertQuery, insertQueryValues);
  }
}

module.exports = new PostUserHelper();
