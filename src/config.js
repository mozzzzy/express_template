const defaultConfig = {
  ACCESS_LOG_FILE_PATH: 'access.log',
  CONNECTION_TIMEOUT_MS: 10000,
  LISTEN_PORT: 3000,
  LOG_LEVEL: 'debug',
  SERVER_LOG_FILE_PATH: 'server.log',
  TERMINATE_CONNECTION_TIMEOUT_MS: 20000,
};

const config = {};

const configKeys = Object.keys(defaultConfig);
configKeys.forEach((key) => {
  config[key] = defaultConfig[key];
  if (process.env[key] === undefined) {
    return;
  }
  // if the type of default value is integer,
  // the only env value that can be parsed as an integer is used.
  if (Number.isInteger(defaultConfig[key])) {
    if (Number.isInteger(parseInt(process.env[key], 10))) {
      config[key] = parseInt(process.env[key], 10);
    }
  } else {
    config[key] = process.env[key];
  }
});

module.exports = config;
