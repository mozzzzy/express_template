/*
 * Module Dependencies
 */

// External modules
const express = require('express');
const log4js = require('log4js');
const { createHttpTerminator } = require('http-terminator');

// Internal modules
const sleepApp = require('./middlewares/sleep');

/*
 * Variables
 */

const accessLogFilePath = 'access.log';
const logLevel = 'debug';
const port = process.env.LISTEN_PORT || 3000;
const serverLogFilePath = 'server.log';
const terminatorTimeOutMs = 10000;

/*
 * Main
 */

// Initialize logger
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    server: { type: 'file', filename: serverLogFilePath },
    access: { type: 'file', filename: accessLogFilePath },
  },
  categories: {
    default: {
      appenders: ['out'],
      level: logLevel,
    },
    server: {
      appenders: ['server', 'out'],
      level: logLevel,
    },
    access: {
      appenders: ['access', 'out'],
      level: logLevel,
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
const server = app.listen(port, () => {
  serverLogger.info(`Server is listening at ${port} port.`);
});

const terminator = createHttpTerminator({
  server,
  gracefulTerminationTimeout: terminatorTimeOutMs,
});

// Handle signals
process.on('SIGTERM', async () => {
  serverLogger.debug('Process got SIGTERM.');

  serverLogger.debug('Terminate all tcp connections.');
  await terminator.terminate();
  serverLogger.debug('Server closed all tcp connections.');
});
