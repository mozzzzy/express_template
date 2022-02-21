/*
 * Module Dependencies
 */

// External modules
const log4js = require('log4js');
const { createHttpTerminator } = require('http-terminator');

// Internal modules
const config = require('./config');
const app = require('./app');

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
    serverLogger.debug('Close all tcp connections.');
    await terminator.terminate();
    serverLogger.debug('Closed all tcp connections successfully.');
  } else {
    serverLogger.debug('Process got SIGINT. But server is already about to terminate.');
  }
});
