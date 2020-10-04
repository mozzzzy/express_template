/*
 * Module Dependencies
 */

// External modules
const express = require('express');
const log4js = require('log4js');
const { createHttpTerminator } = require('http-terminator');

// Internal modules
const config = require('./config');
const sleepApp = require('./middlewares/sleep');

/*
 * Variables
 */

const terminatorTimeOutMs = 10000;

/*
 * Main
 */

// Initialize logger
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    server: { type: 'file', filename: config.SERVER_LOG_FILE_PATH },
    access: { type: 'file', filename: config.ACCESS_LOG_FILE_PATH },
  },
  categories: {
    default: {
      appenders: ['out'],
      level: config.LOG_LEVEL,
    },
    server: {
      appenders: ['server', 'out'],
      level: config.LOG_LEVEL,
    },
    access: {
      appenders: ['access', 'out'],
      level: config.LOG_LEVEL,
      layout: {
        type: 'pattern',
        pattern: '%d %m',
      },
    },
  },
});
const serverLogger = log4js.getLogger('server');
const accessLogger = log4js.getLogger('access');

// Initialize app
const app = express();

// Add middleware here
app.get('/sleep', sleepApp);

// Error handler
app.use((err, req, res, next) => {
  serverLogger.error(err.stack);
  res.status(500).send('Unexpected Server Error.');
  next();
});

// Log access
app.use((req, res) => {
  accessLogger.info(`${req.hostname} ${req.method} ${req.originalUrl} ${res.statusCode}`);
});

// Listen
const server = app.listen(config.LISTEN_PORT, () => {
  serverLogger.info(`Server is listening at ${config.LISTEN_PORT} port.`);
});

const terminator = createHttpTerminator({
  server,
  gracefulTerminationTimeout: config.TERMINATE_CONNECTION_TIMEOUT_MS,
});

// Handle signals
process.on('SIGTERM', async () => {
  serverLogger.debug('Process got SIGTERM.');

  serverLogger.debug('Terminate all tcp connections.');
  await terminator.terminate();
  serverLogger.debug('Server closed all tcp connections.');
});
