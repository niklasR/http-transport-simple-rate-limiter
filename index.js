'use strict';
const simpleRateLimiter = require('simple-rate-limiter');

class Limiter {
  constructor(countLimit, countDuration) {
    this.waitForNext = simpleRateLimiter((cb) => {
      cb();
    }).to(countLimit).per(countDuration);
  }

  limit(ctx, next) {
    return new Promise((resolve) => {
      this.waitForNext(() => {
        return resolve(next());
      });
    });
  }
}

module.exports = (countLimit, countDuration) => {
  const limiter = new Limiter(countLimit, countDuration);
  return limiter.limit.bind(limiter);
};
