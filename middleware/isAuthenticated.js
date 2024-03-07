const { UnauthorizedError } = require("../expressError");

/**
 * Throws Unauthorized Error if user is not in session 
 */
function isAuthenticated (req, res, next) {
  console.log(req)
    if (!req.session.passport.user) throw new UnauthorizedError('Must be logged in')
    else next()
  }

module.exports = isAuthenticated;