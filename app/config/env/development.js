'use strict';

module.exports = {
  dbUser: process.env.DB_USER || 'user_admin',
  dbName: process.env.DB_NAME || 'user',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'password',
  dbPort: process.env.DB_PORT || '5432'
};
