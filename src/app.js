// External modules
const express = require('express');
const log4js = require('log4js');

// Internal modules
const sleepApp = require('./middlewares/sleep');

// Get logger
const accessLogger = log4js.getLogger('access');
const serverLogger = log4js.getLogger('server');

const app = express();

// Add middleware here
app.get('/sleep', sleepApp);

// Handle requests to unexpected paths.
app.all('*', (req, res, next) => {
  if (!res.headersSent) {
    serverLogger.debug('No route is found. Send 404 response code.');
    res.status(404).end();
  }
  next();
});

// Handle Errors
app.use((err, req, res, next) => {
  serverLogger.error(err.stack);
  res.status(500).send('Unexpected Server Error.');
  next();
});

// Log access
app.use((req, res) => {
  accessLogger.info(`${req.hostname} ${req.method} ${req.originalUrl} ${res.statusCode}`);
});

module.exports = app;
