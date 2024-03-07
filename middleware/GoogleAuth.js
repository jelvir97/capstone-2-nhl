const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const User = require('../models/users')
const {BASE_URL} =  require('../config')

// Google Strategy Config
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: `${BASE_URL}/oauth2/redirect/google`,
  },

  async function(request, accessToken, refreshToken, profile, done){
    console.log('profile', profile)
    try{
      const user  =  await User.get(profile.id)
      console.log('user found', user.firstName)
      done(null, user)
    }catch(err){
      const user = await User.register({googleID:profile.id, 
                                        firstName:profile.name.givenName, 
                                        lastName:profile.name.familyName, 
                                        email:profile.emails[0].value})

      done(null,user)
    }
  }
));

/**
 *  Serializer
 * 
 *  Gets google id from request.
 */
passport.serializeUser(function(user, done) {
  console.log('in serialize',user)
  try{
    done(null,user.googleID)
  }catch(err){
    done(err)
  }
  
});

/**
 *  Deserializer
 * 
 *  Finds user in db.
 *  Puts User object onto session.
 */
passport.deserializeUser(async function(id, done) {
  try{
    const user = await User.get(id)
    done(null,user)
  }catch(err){
    done(err)
  }
});

module.exports = passport;