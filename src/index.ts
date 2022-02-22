/*
 * Module Dependencies
 */

// External modules
import { configure, getLogger } from 'log4js';
import { createHttpTerminator } from 'http-terminator';

// Internal modules
import config from './config';
import app from './app';

/*
 * Main
 */

// Initialize logger
const log4jsConfig = {
  appenders: {
    out: { type: 'stdout' },
    server: { type: 'file', filename: config.getStr('SERVER_LOG_FILE_PATH') },
    access: { type: 'file', filename: config.getStr('ACCESS_LOG_FILE_PATH') },
  },
  categories: {
    default: {
      appenders: ['out'],
      level: config.getStr('LOG_LEVEL'),
    },
    server: {
      appenders: ['server', 'out'],
      level: config.getStr('LOG_LEVEL'),
    },
    access: {
      appenders: ['access', 'out'],
      level: config.getStr('LOG_LEVEL'),
      layout: {
        type: 'pattern',
        pattern: '%d %m',
      },
    },
  },
};
configure(log4jsConfig);
const serverLogger = getLogger('server');

// Listen
const server = app.listen(config.getNumber('LISTEN_PORT'), () => {
  serverLogger.info(`Server is listening at ${config.getNumber('LISTEN_PORT')} port.`);
});

// Set timeout(millisecond)
server.timeout = config.getNumber('CONNECTION_TIMEOUT_MS');

const terminator = createHttpTerminator({
  server,
  gracefulTerminationTimeout: config.getNumber('TERMINATE_CONNECTION_TIMEOUT_MS'),
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
