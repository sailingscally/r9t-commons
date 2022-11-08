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

/**
 * Shared enums.
 */

const WeatherAlert = {
  NONE:                0b00000000,
  POOR:                0b00000001,
  RAIN:                0b00000010,
  WIND:                0b00000100,
  STRONG_WIND:         0b00001000,
  GALE:                0b00010000,
  STORM:               0b00100000,
  FIRESTORM:           0b01000000,
  SEVERE_THUNDERSTORM: 0b10000000
}

/**
 * Utility methods.
 */

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Module exports.
 */

exports.WeatherAlert = WeatherAlert;

exports.sleep = sleep;
