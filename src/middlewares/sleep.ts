// External modules
import express from 'express';
import { getLogger } from 'log4js';

// Get logger
const serverLogger = getLogger('server');

const buildBody = (msg: string) => ({
  msg,
});

const app = express();
app.get('/sleep', (req, res, next) => {
  const sleepTimeMsStr = req.query.ms;
  if (sleepTimeMsStr === undefined) {
    res.status(400).json(buildBody('Query ms=<milli second> is required.'));
    next();
    return;
  }
  if (typeof sleepTimeMsStr !== 'string') {
    res.status(400).json(buildBody('Invalid query ms=<milli second>.'));
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

export default app;
