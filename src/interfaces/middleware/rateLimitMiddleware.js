const rateLimit = require('express-rate-limit');
const config = require('../../config/environment');

const createRateLimit = (windowMs = config.rateLimit.windowMs, max = config.rateLimit.max) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const generalRateLimit = createRateLimit();
const authRateLimit = createRateLimit(15 * 60 * 1000, 5);

module.exports = {
  generalRateLimit,
  authRateLimit,
};