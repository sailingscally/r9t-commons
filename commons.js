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
const profiler = require('./profiler.js');

/**
 * Logging configuration.
 *
 * When running under PM2, behave as production, set the log level to info and let PM2 handle/store them.
 * When running from the console, behave as development, set the log level to debug and use pretty printing.
 *
 * If LOG_LEVEL is defined, the specified log level will be used instead but only for development mode.
 */

const DATETIME_FORMAT = 'yyyy-mm-dd HH:MM:ss.l';

const config = () => {
  if(process.env.PM2_HOME != undefined) {
    return { level: 'info' };
  } else {
    return {
      level: process.env.LOG_LEVEL || 'debug',
      transport: { target: 'pino-pretty', options: { colorize: true, translateTime: DATETIME_FORMAT } }
    };
  }
};

const logger = pino(config());

/**
 * Shared enums.
 */

const WeatherAlert = {
  /* eslint-disable key-spacing */
  NONE:                0b00000000,
  POOR:                0b00000001,
  RAIN:                0b00000010,
  WIND:                0b00000100,
  STRONG_WIND:         0b00001000,
  GALE:                0b00010000,
  STORM:               0b00100000,
  FIRESTORM:           0b01000000,
  SEVERE_THUNDERSTORM: 0b10000000
  /* eslint-enable key-spacing */
};

/**
 * Utility methods.
 */

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const arg = (name) => {
  const regex = new RegExp(`--${name}=(.*)`);
  let value = process.argv.find((arg) => regex.test(arg));

  if(value === undefined) {
    logger.warn('Console argument "%s" was not found.', name);
    return undefined;
  }

  value = value.match(regex)[1];
  return isNaN(value) ? value : parseInt(value);
};

/**
 * Module exports.
 */

exports.log = logger;
exports.profiler = profiler(logger);

exports.WeatherAlert = WeatherAlert;

exports.sleep = sleep;
exports.arg = arg;
