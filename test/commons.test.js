/*
 * Copyright 2022 Luis Martins <luis.martins@gmail.com>
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 */

const { WeatherAlert } = require('../commons.js');

const commons = require('../commons.js');

describe('Logging', () => {
  test('Format', () => {
    expect(commons.__get__('DATETIME_FORMAT')).toEqual('yyyy-mm-dd HH:MM:ss.l');
  });

  test('Production (PM2)', () => {
    process.env.PM2_HOME = '/home/user/.pm2';
    const config = commons.__get__('config')();

    expect(config.level).toEqual('info');
    delete process.env.PM2_HOME;
  });

  test('Development', () => {
    const config = commons.__get__('config')();

    expect(config.level).toEqual('debug');
    expect(config.transport.target).toEqual('pino-pretty');
    expect(config.transport.options.colorize).toEqual(true);
  });

  test('Log Level', () => {
    expect(commons.log.level).toEqual('debug');
  });
});

describe('Weather Alert', () => {
  test('Keys', () => {
    const keys = Object.keys(WeatherAlert);

    expect(keys.length).toEqual(9);
    expect(keys).toContain('NONE');
    expect(keys).toContain('POOR');
    expect(keys).toContain('RAIN');
    expect(keys).toContain('WIND');
    expect(keys).toContain('STRONG_WIND');
    expect(keys).toContain('GALE');
    expect(keys).toContain('STORM');
    expect(keys).toContain('FIRESTORM');
    expect(keys).toContain('SEVERE_THUNDERSTORM');
  });

  test('Values', () => {
    const keys = Object.keys(WeatherAlert);
    let value = 0b10000000;

    for(let i = keys.length - 1; i >= 0; i --) {
      expect(WeatherAlert[keys[i]]).toEqual(value);
      value = value >> 1;
    }
  });
});

describe('Sleep', () => {
  test('Promise', () => {
    expect(commons.sleep(100)).toBeInstanceOf(Promise);
  });

  test('Wait 250ms', async () => {
    const dt = Date.now();
    await commons.sleep(250);
    const diff = Date.now() - dt;

    expect(diff).toBeGreaterThanOrEqual(250);
    expect(diff).toBeLessThan(250 * 1.10); // expect up to 10% more
  });
});

describe('Console Arguments', () => {
  let original = undefined;

  beforeEach(() => {
    original = process.argv;

    commons.log.warn = jest.fn();

    process.argv = [
      '/opt/nodejs/bin/node',
      '/home/ljm/projects/r9t-commons/test/commons.test.js',
      '--port=3000',
      '--host=localhost'
    ];
  });

  afterEach(() => {
    process.argv = original;
    original = undefined;

    jest.restoreAllMocks();
  });

  test('Missing', () => {
    const value = commons.arg('target');

    expect(value).toBeUndefined();
    expect(commons.log.warn).toHaveBeenCalledTimes(1);
    expect(commons.log.warn).toHaveBeenCalledWith('Console argument "%s" was not found.', 'target');
  });

  test('String', () => {
    const value = commons.arg('host');

    expect(value).toEqual('localhost');
    expect(typeof value).toEqual('string');
  });

  test('Number', () => {
    const value = commons.arg('port');

    expect(value).toEqual(3000);
    expect(typeof value).toEqual('number');
  });
});

describe('Profiler', () => {
  beforeEach(() => {
    commons.log.info = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Wait 250ms', async () => {
    commons.profiler.start('benchmark');
    await commons.sleep(250);
    commons.profiler.stop('benchmark');

    expect(commons.log.info).toHaveBeenCalledTimes(1);
    expect(commons.log.info).toHaveBeenCalledWith(
        'Elapsed time for "%s" profile: %s nanoseconds.', 'benchmark', expect.anything());
  });
});
