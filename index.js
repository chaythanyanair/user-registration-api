'use strict'

const express = require('express');
const morgan = require('morgan');
const logger = require('./app/utils/logger')
const bodyParser = require('body-parser');
const dbOps = require('./app/config/data_source');
const dbMigrate = require('db-migrate');
const pgPool = require('./app/config/data_source')
const lockName = 12;
let postgresClient = null

// Init database connection
dbOps
  .initializeDb()
  .then(async () => {
    logger.info('Connected to db...');
    postgresClient = await pgPool.dbClient
  }).then(migrateAll)
  .catch((err) => {
    logger.error(err);
  });

function getDbMigrateInstance() {
  process.env.PSQL_PORT = process.env.PSQL_PORT || 5432;
  const dbmigrate = dbMigrate.getInstance(true, {
    sqlFile: true,
    config: './app/config/database.json',
    cmdOptions: {
      'migrations-dir': './app/config/migrations/'
    },
    env: 'default',
    throwUncatched: true
  });
  dbmigrate.silence(true);
  return dbmigrate;
}

function migrateAll() {
  const dbMigrateInstance = getDbMigrateInstance();
          return runMigration(dbMigrateInstance);
}

function lock() {
  return postgresClient.query(
    `SELECT pg_try_advisory_lock(${lockName})`)
    .then(({rows}) => {
      if (rows && rows.length === 1 && rows[0]['pg_try_advisory_lock']) {
        logger.info('Lock obtained', {
          lockName
        });
        return true;
      } else {
        return Promise.reject(`Lock was not obtained for ${lockName}`);
      }
    });
}

function release(scope) {
  logger.info(`Releasing lock ${lockName} for ${scope || 'coupon'}...`);
  return postgresClient.query(`SELECT pg_advisory_unlock('${lockName}');`)
    .then(({rows}) => {
      if (Array.isArray(rows) && rows.length === 1 &&
        rows[0]['pg_advisory_unlock']) {
        logger.info(`Lock ${lockName} released for ${scope || 'coupon'}.`);
      } else {
        logger.info(`Cannot release lock ${lockName} for ${scope || 'coupon'}.`);
      }
    });
}

function runMigration(dbmigrate) {
  return lock()
    .then(() => dbmigrate.up(null))
    .then(() => release())
    .then(() => postgresClient.release());
}

// Init the express application
const app = express();

 // Enable logger (morgan)
 app.use(morgan('dev'));

 app.use(bodyParser.json());

 app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

 // ELB status check
 app.get('/status.html', function (req, res) {
  res.status(200).send();
});

// Register routes
require('./app/routes')(app);

// Catch-all error handler
app.use(function (error, req, res, next) {
    logger.error(error.message);
    logger.error(error.stack);
    res.status(500).json({
      code: 1000,
      msg: 'Internal Server Error',
    });
});

// Assume 404 since no middleware responded
app.use(function (req, res) {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`) 
});

// Start the app by listening on <port>
app.listen(9000);

// Expose app
exports = module.exports = app;

// Logging initialization
logger.info(`API Server started on port 9000`);
