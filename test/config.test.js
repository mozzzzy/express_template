const defaultConfig = {
  ACCESS_LOG_FILE_PATH: 'access.log',
  CONNECTION_TIMEOUT_MS: 10000,
  LISTEN_PORT: 3000,
  LOG_LEVEL: 'debug',
  SERVER_LOG_FILE_PATH: 'server.log',
  TERMINATE_CONNECTION_TIMEOUT_MS: 20000,
};

describe('Test of config module', () => {
  afterEach(() => {
    delete process.env.ACCESS_LOG_FILE_PATH;
    delete process.env.LISTEN_PORT;
    jest.resetModules();
  });

  test('Default values can be used.', () => {
    /* eslint-disable-next-line global-require */
    const config = require('../src/config');
    expect(config).toEqual(defaultConfig);
  });

  test('Default values can be overwrote by env (string).', () => {
    process.env.ACCESS_LOG_FILE_PATH = 'log/access.log';
    /* eslint-disable-next-line global-require */
    const config = require('../src/config');

    const overwroteConfig = { ...defaultConfig };
    overwroteConfig.ACCESS_LOG_FILE_PATH = 'log/access.log';

    expect(config).toEqual(overwroteConfig);
  });

  test('Default values can be overwrote by env (integer).', () => {
    process.env.LISTEN_PORT = '80';
    /* eslint-disable-next-line global-require */
    const config = require('../src/config');

    const overwroteConfig = { ...defaultConfig };
    overwroteConfig.LISTEN_PORT = 80;

    expect(config).toEqual(overwroteConfig);
  });
});
