// External modules
const express = require('express');
const log4js = require('log4js');

// Get logger
const serverLogger = log4js.getLogger('server');

const buildBody = msg => {
  return {
    msg
  };
};

const app = express();
app.get('/sleep', (req, res, next) => {
  const sleepTimeMsStr = req.query.ms;
  if (sleepTimeMsStr === undefined) {
    res.status(400).json(buildBody('Query ms=<milli second> is required.'));
    next();
    return;
  }
  const sleepTimeMs = parseInt(sleepTimeMsStr, 10);
  if (Number.isNaN(sleepTimeMs)) {
    res.status(400).json(buildBody(`Invalid query ms="${sleepTimeMsStr}".`));
    next();
    return;
  }
  if (!Number.isSafeInteger(sleepTimeMs)) {
    res.status(400).send(buildBody(`Query ms="${sleepTimeMsStr}" is too large.`));
    next();
    return;
  }

  serverLogger.debug(`Sleep ${sleepTimeMs} milli seconds and return response.`);
  setTimeout(() => {
    res.status(200).json(buildBody('OK'));
    next();
  }, sleepTimeMs);
});

module.exports = app;
