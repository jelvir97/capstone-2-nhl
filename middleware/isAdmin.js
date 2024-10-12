const { UnauthorizedError } = require("../expressError");


/**
 * Throws UnauthorizedError if admin is false
 */
function isAdmin (req, res, next) {
    try{
      if (!req.user.isAdmin) throw new UnauthorizedError('Must be admin')
        else next()
    }catch{
      throw new UnauthorizedError('Must be admin')
    }
  }

module.exports = isAdmin;