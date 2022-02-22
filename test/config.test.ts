describe('Test of config module', () => {
  afterEach(() => {
    delete process.env.ACCESS_LOG_FILE_PATH;
    delete process.env.LISTEN_PORT;
    jest.resetModules();
  });

  test('Default values can be used.', async () => {
    const module = await import('../src/config');
    const config = module.default;
    const { defaultConfigNumbers, defaultConfigStrings } = module;

    const defaultConfigNumbersItr = defaultConfigNumbers.entries();
    for (let itr = defaultConfigNumbersItr.next();
      itr.done === false;
      itr = defaultConfigNumbersItr.next()) {
      const key = itr.value[0];
      const defaultValue = itr.value[1];
      expect(config.getNumber(key)).toBe(defaultValue);
    }
    const defaultConfigStringsItr = defaultConfigStrings.entries();
    for (let itr = defaultConfigStringsItr.next();
      itr.done === false;
      itr = defaultConfigStringsItr.next()) {
      const key = itr.value[0];
      const defaultValue = itr.value[1];
      expect(config.getStr(key)).toBe(defaultValue);
    }
  });

  test('Default values can be overwrote by env (string).', async () => {
    process.env.ACCESS_LOG_FILE_PATH = 'log/access.log';

    const module = await import('../src/config');
    const config = module.default;
    const { defaultConfigNumbers, defaultConfigStrings } = module;

    defaultConfigStrings.set('ACCESS_LOG_FILE_PATH', 'log/access.log');

    const defaultConfigNumbersItr = defaultConfigNumbers.entries();
    for (let itr = defaultConfigNumbersItr.next();
      itr.done === false;
      itr = defaultConfigNumbersItr.next()) {
      const key = itr.value[0];
      const defaultValue = itr.value[1];
      expect(config.getNumber(key)).toBe(defaultValue);
    }
    const defaultConfigStringsItr = defaultConfigStrings.entries();
    for (let itr = defaultConfigStringsItr.next();
      itr.done === false;
      itr = defaultConfigStringsItr.next()) {
      const key = itr.value[0];
      const defaultValue = itr.value[1];
      expect(config.getStr(key)).toBe(defaultValue);
    }
  });

  test('Default values can be overwrote by env (integer).', async () => {
    process.env.LISTEN_PORT = '80';

    const module = await import('../src/config');
    const config = module.default;
    const { defaultConfigNumbers, defaultConfigStrings } = module;

    defaultConfigNumbers.set('LISTEN_PORT', 80);

    const defaultConfigNumbersItr = defaultConfigNumbers.entries();
    for (let itr = defaultConfigNumbersItr.next();
      itr.done === false;
      itr = defaultConfigNumbersItr.next()) {
      const key = itr.value[0];
      const defaultValue = itr.value[1];
      expect(config.getNumber(key)).toBe(defaultValue);
    }
    const defaultConfigStringsItr = defaultConfigStrings.entries();
    for (let itr = defaultConfigStringsItr.next();
      itr.done === false;
      itr = defaultConfigStringsItr.next()) {
      const key = itr.value[0];
      const defaultValue = itr.value[1];
      expect(config.getStr(key)).toBe(defaultValue);
    }
  });
});
