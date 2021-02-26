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

app.all('*', (req, res, next) => {
  if (!res.headersSent) {
    serverLogger.debug('No route is found. Send 404 response code.');
    res.status(404).end();
  }
  next();
});

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

// Set timeout(millisecond)
server.timeout = config.CONNECTION_TIMEOUT_MS;

const terminator = createHttpTerminator({
  server,
  gracefulTerminationTimeout: config.TERMINATE_CONNECTION_TIMEOUT_MS,
});

// Handle signals
let terminating = false;
process.on('SIGINT', async () => {
  if (!terminating) {
    serverLogger.debug('Process got SIGINT.');
    terminating = true;
    serverLogger.debug('Terminate all tcp connections.');
    await terminator.terminate();
    serverLogger.debug('Server closed all tcp connections.');
  } else {
    serverLogger.debug('Process got SIGINT. But server is already about to terminate.');
  }
});
