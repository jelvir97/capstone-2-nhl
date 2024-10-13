
/**
 * Function for mocking tests.
 * 
 * Allows for setting of session and user object in http requests.
 * 
 * 
 */
function MockAuth (req, res, next) {
  if(!req.session){
    req.session = {}
    req.session.passport = {}
  }
  next()
  }

module.exports = MockAuth;