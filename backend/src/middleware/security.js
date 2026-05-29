const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');

exports.helmetMiddleware = helmet();

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

exports.xssSanitize = xss();

exports.hppProtect = hpp();
