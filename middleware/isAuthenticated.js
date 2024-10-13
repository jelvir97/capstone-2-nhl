const { UnauthorizedError } = require("../expressError");

/**
 * Throws Unauthorized Error if user is not in session
 */
function isAuthenticated(req, res, next) {
  // console.log('isAuthenticated', req.session)
  // console.log('isAuthenticated', req.user)

  try {
    if (!req.session.passport.user)
      throw new UnauthorizedError("Must be logged in");
    else next();
  } catch {
    throw new UnauthorizedError("Must be logged in");
  }
}

module.exports = isAuthenticated;
