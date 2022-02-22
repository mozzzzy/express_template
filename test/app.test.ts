import { getLogger } from 'log4js';
import request from 'supertest';
import app from '../src/app';

/* eslint-disable-next-line no-unused-vars */
const sleepApp = require('../src/middlewares/sleep');

// Helper functions
function sleep(msec: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, msec);
  });
}

// Mock error(), info(), debug(), methods of log4js.
jest.mock('log4js', () => {
  const accessLogger = {
    info: jest.fn(),
  };
  const serverLogger = {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };

  return {
    getLogger: (name: string) => {
      switch (name) {
        case 'access':
          return accessLogger;
        case 'server':
          return serverLogger;
        default:
          return undefined;
      }
    },
  };
});

// Mock sleepApp.
// FIXME: I couldn't implement dummy app in each test case. So I implement it here.
//        But I want to separate dummy app like dummyAppReturn200 and dummyAppReturn400,
//        dummyAppThrowError.
jest.mock('../src/middlewares/sleep', () => jest.fn((req, res, next) => {
  switch (req.query.dummyStatus) {
    case '200':
      res.status(200).end();
      break;
    case '400':
      res.status(400).end();
      break;
    default:
      throw new Error('dummy error.');
  }
  next();
}));

describe('Test of app module', () => {
  describe('App write access log for any request.', () => {
    const sleepMsec = 1;

    beforeEach(() => {
      (getLogger('access').info as jest.Mock).mockClear();
    });

    test('When middleware sends 200 response, app write access log.', async () => {
      const res = await request(app).get('/sleep?dummyStatus=200');
      expect(res.statusCode).toBe(200);
      // Wait for the app to write the access log.
      await sleep(sleepMsec);
      expect(getLogger('access').info).toHaveBeenCalledTimes(1);
    });

    test('When middleware sends 400 response, app write access log.', async () => {
      const res = await request(app).get('/sleep?dummyStatus=400');
      expect(res.statusCode).toBe(400);
      // Wait for the app to write the access log.
      await sleep(sleepMsec);
      expect(getLogger('access').info).toHaveBeenCalledTimes(1);
    });

    test('When middleware throws error, app write access log.', async () => {
      const res = await request(app).get('/sleep');
      expect(res.statusCode).toBe(500);
      // Wait for the app to write the access log.
      await sleep(sleepMsec);
      expect(getLogger('access').info).toHaveBeenCalledTimes(1);
    });
  });

  test('App catches errors thrown by middleware and sends 500 response', async () => {
    const res = await request(app).get('/sleep');
    expect(res.statusCode).toBe(500);
  });
});
