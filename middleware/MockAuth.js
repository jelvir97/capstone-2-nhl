
/**
 * Function for mocking tests.
 * 
 * Allows for setting of session and user object in http requests.
 * 
 *  For FUTURE: Could also be done through requests.
 */
function MockAuth (req, res, next) {
  req.session = {}
  req.session.passport = {}
  next()
  }

module.exports = MockAuth;