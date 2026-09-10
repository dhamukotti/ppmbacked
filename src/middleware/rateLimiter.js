const rateLimit = require('express-rate-limit')

module.exports.rateLimiterUsingThirdParty = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: 'You have exceeded the 1000 requests in 1 hr limit!',
  standardHeaders: true,
  legacyHeaders: false
})
