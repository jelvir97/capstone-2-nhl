const { UnauthorizedError } = require("../expressError");

function isAuthenticated (req, res, next) {
    if (!req.session.user) throw new UnauthorizedError('Must be logged in')
    else next()
  }

module.exports = isAuthenticated;