// External modules
import express from 'express';
import { getLogger, Logger } from 'log4js';

// Internal modules
import sleepApp from './middlewares/sleep';

// Get logger
const accessLogger: Logger = getLogger('access');
const serverLogger = getLogger('server');

const app: express.Express = express();

// Add middleware here
app.get('/sleep', sleepApp);

// Handle requests to unexpected paths.
app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!res.headersSent) {
    serverLogger.debug('No route is found. Send 404 response code.');
    res.status(404).end();
  }
  next();
});

// Handle Errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  serverLogger.error(err.stack);
  res.status(500).send('Unexpected Server Error.');
  next();
});

// Log access
app.use((req: express.Request, res: express.Response) => {
  accessLogger.info(`${req.hostname} ${req.method} ${req.originalUrl} ${res.statusCode}`);
});

export default app;
