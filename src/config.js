const defaultConfig = {
  ACCESS_LOG_FILE_PATH:            'access.log',
  LISTEN_PORT:                     3000,
  LOG_LEVEL:                       'debug',
  SERVER_LOG_FILE_PATH:            'server.log',
  TERMINATE_CONNECTION_TIMEOUT_MS: 10000,
}

const config = {};

for (key in defaultConfig) {
  config[key] = defaultConfig[key];

  if (process.env[key] === undefined) {
    continue;
  }

  // if the type of default value is integer,
  // the only env value that can be parsed as an integer is used.
  if (Number.isInteger(defaultConfig[key])) {
    if (Number.isInteger(parseInt(process.env[key]))) {
      config[key] = parseInt(process.env[key]);
    }
  } else if (typeof config[key] === "boolean") {
    if (process.env[key] === 'true') {
      config[key] = true;
    }
    if (process.env[key] === 'false') {
      config[key] = false;
    }
  } else {
    config[key] = process.env[key];
  }
}

module.exports = config;
