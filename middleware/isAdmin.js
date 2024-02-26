const { UnauthorizedError } = require("../expressError");

function isAdmin (req, res, next) {
    if (!req.session.user.isAdmin) throw new UnauthorizedError('Must be admin')
    else next()
  }

module.exports = isAdmin;