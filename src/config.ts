// Export defaultConfigStrings for test.
export const defaultConfigNumbers = new Map<string, number>([
  ['CONNECTION_TIMEOUT_MS', 10000],
  ['LISTEN_PORT', 3000],
  ['TERMINATE_CONNECTION_TIMEOUT_MS', 20000],
]);

// Export defaultConfigNumbers for test.
export const defaultConfigStrings = new Map<string, string>([
  ['ACCESS_LOG_FILE_PATH', 'access.log'],
  ['LOG_LEVEL', 'debug'],
  ['SERVER_LOG_FILE_PATH', 'server.log'],
]);

class Config {
  private readonly configNumbers: Map<string, number>;

  private readonly configStrings: Map<string, string>;

  constructor() {
    // Initialize configNumbers.
    this.configNumbers = new Map<string, number>(defaultConfigNumbers);
    const configNumberKeys = this.configNumbers.keys();
    for (let keyItr = configNumberKeys.next();
      keyItr.done === false;
      keyItr = configNumberKeys.next()) {
      const key = keyItr.value;
      const value = process.env[key];
      if (value === undefined) {
        continue;
      }
      const valueNumber = parseInt(value, 10);
      if (Number.isNaN(valueNumber)) {
        continue;
      }
      this.configNumbers.set(key, valueNumber);
    }
    // Initialize configStrings.
    this.configStrings = new Map<string, string>(defaultConfigStrings);
    const configStringKeys = this.configStrings.keys();
    for (let keyItr = configStringKeys.next();
      keyItr.done === false;
      keyItr = configStringKeys.next()) {
      const key = keyItr.value;
      const value = process.env[key];
      if (value === undefined) {
        continue;
      }
      this.configStrings.set(key, value);
    }
  }

  public getStr(key: string): string {
    const value = this.configStrings.get(key);
    if (value === undefined) {
      throw new Error(`Value of config key ${key} was not found.`);
    }
    return value;
  }

  public getNumber(key: string): number {
    const value = this.configNumbers.get(key);
    if (value === undefined) {
      throw new Error(`Value of config key ${key} was not found.`);
    }
    return value;
  }
}

const config = new Config();

export default config;
