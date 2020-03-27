'use strict';

const { Pool } = require('pg');
const config = require('./env/development');

class PgPool {
  constructor() { }

  initializeDb() {
    return new Promise((resolve, reject) => {
      this.pool = new Pool({
        user: config.dbUser,
        host: config.host,
        database: config.dbName,
        password: config.password,
        port: config.dbPort,
      });

      this.pool.connect((err, client) => {
        if (err) {
          reject(err);
        }
        this.dbClient = client;
        resolve();
      });
    });
  }
}

module.exports = new PgPool();
