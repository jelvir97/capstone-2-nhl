const { UnauthorizedError } = require("../expressError");


/**
 * Throws UnauthorizedError if admin is false
 */
function isAdmin (req, res, next) {
    if (!req.session.passport.user.isAdmin) throw new UnauthorizedError('Must be admin')
    else next()
  }

module.exports = isAdmin;