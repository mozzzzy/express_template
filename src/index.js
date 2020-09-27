/*
 * Module Dependencies
 */

// External modules
const express = require('express');
const log4js = require('log4js');

// Internal modules
const sleepApp = require('./middlewares/sleep');

/*
 * Variables
 */

const logLevel = 'debug';
const port = process.env.LISTEN_PORT || 3000;
const shutdowningFlagName = 'shutdowning';
const serverLogFilePath = 'server.log';
const accessLogFilePath = 'access.log';

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
      level: logLevel
    },
    server: {
      appenders: ['server', 'out'],
      level: logLevel
    },
    access: {
      appenders: ['access', 'out'],
      level: logLevel,
      layout: {
        type: 'pattern',
        pattern: '%d %m',
      }
    },
  }
});
const serverLogger = log4js.getLogger('server');
const accessLogger = log4js.getLogger('access');

// Initialize app
const app = express();
app.set(shutdowningFlagName, false);

// When shutdowning flag is true, set "Connection: close" header to response.
app.use((req, res, next) => {
  const shutdowningFlag = app.get(shutdowningFlagName);
  serverLogger.debug(`Check shutdowning flag. Shutdowning flag is \"${shutdowningFlag}\".`);
  if (shutdowningFlag) {
    serverLogger.debug('Set Connection close header to response.');
    res.set('Connection', 'close');
  }
  next();
});

// Add middleware here
app.get('/sleep', sleepApp);

// When app sent the http response and it has "Connection: close" header,
// close tcp connection.
app.use((req, res, next) => {
  const connectionHeader = res.get('Connection');
  if (res.headersSent && connectionHeader === 'close') {
    serverLogger.debug(`Server sent Connection close header. Close tcp connection.`);
    res.connection.destroy();
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
const server = app.listen(port, () => {
  serverLogger.info(`Server is listening at ${port} port.`);
});

// Handle signals
process.on('SIGTERM', () => {
  serverLogger.debug('Process got SIGTERM.');

  serverLogger.debug('Set shutdowning flag true.');
  app.set(shutdowningFlagName, true);

  server.close(() => {
    serverLogger.debug('Server closed all tcp connections.');
  });
});
