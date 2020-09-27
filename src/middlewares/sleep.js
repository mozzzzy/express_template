// External modules
const express = require('express');
const log4js = require('log4js');

// Get logger
const serverLogger = log4js.getLogger('server');

const app = express();
app.get('/sleep', (req, res, next) => {
  const sleepTimeMsStr = req.query.ms;
  if (sleepTimeMsStr === undefined) {
    res.status(400).send('Query ms=<milli second> is required.');
    next();
    return;
  }
  sleepTimeMs = parseInt(sleepTimeMsStr, 10);
  if (Number.isNaN(sleepTimeMs)) {
    res.status(400).send(`Invalid query ms=\"${sleepTimeMsStr}\".`);
    next();
    return;
  }
  if (!Number.isSafeInteger(sleepTimeMs)) {
    res.status(400).send(`Query ms=\"${sleepTimeMsStr}\" is too large.`);
    next();
    return;
  }

  serverLogger.debug(`Sleep ${sleepTimeMs} milli seconds and return response.`);
  setTimeout(() => {
    res.status(200).send('OK');
    next();
  }, sleepTimeMs);
});

module.exports = app;
