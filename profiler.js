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

class Profiler {
  constructor(logger) {
    this.log = logger;
    this.profiles = {};
  }

  start(key) {
    if(this.profiles[key]) {
      this.log.warn('Restarting profile "%s".', key);
    }

    // https://nodejs.org/api/process.html#processhrtimebigint (added in: v10.7.0)
    this.profiles[key] = process.hrtime.bigint();
  }

  stop(key) {
    if(!this.profiles[key]) {
      this.log.warn('Profile "%s" hasn\'t been started.', key);
      return;
    }

    const diff = process.hrtime.bigint() - this.profiles[key];
    this.log.info('Elapsed time for "%s" profile: %s nanoseconds.', key, diff.toLocaleString('en-US'));

    if(this.log.level == 'debug') {
      // TODO: calculate elapsed time in human readable format
      this.log.debug({}, 'Profiling details: ...');
    }

    delete this.profiles[key];
  }
}

module.exports = (logger) => {
  return new Profiler(logger);
};
