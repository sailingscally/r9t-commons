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

const pino = require('pino');
const logger = pino({ level: 'info' });

const profiler = require('../profiler.js')(logger);

describe('Profiler', () => {
  beforeEach(() => {
    logger.warn = jest.fn();
    logger.info = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Constructor', () => {
    expect(typeof profiler).toEqual('object');
    expect(logger.level).toEqual('info');
  });

  test('Start Twice', () => {
    profiler.start('start');
    profiler.start('start');

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith('Restarting profile "%s".', 'start');
  });

  test('Stop non Started', () => {
    profiler.stop('stop');

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith('Profile "%s" hasn\'t been started.', 'stop');
  });

  test('Start & Stop', () => {
    profiler.start('profile');
    profiler.stop('profile');

    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
        'Elapsed time for "%s" profile: %s nanoseconds.', 'profile', expect.anything());
  });
});

describe('Profiler w/ Details', () => {
  beforeEach(() => {
    logger.level = 20;
    logger.debug = jest.fn();
  });

  afterEach(() => {
    logger.level = 30;
    jest.restoreAllMocks();
  });

  test('Start & Stop', () => {
    profiler.start('profile');
    profiler.stop('profile');

    expect(logger.debug).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(expect.anything(), 'Profiling details: ...');
  });
});
