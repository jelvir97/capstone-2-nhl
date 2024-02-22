const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const User = require('../models/users')

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
  },

  async function(request, accessToken, refreshToken, profile, done){
    //console.log(profile) 
    try{
      const user  =  await User.get(profile.id)
      console.log('user found', user.firstName)
      done(null, user)
    }catch(err){
      console.log('ERRRORRR', err)
      const user = await User.register({google_id:profile.id, 
                                        firstName:profile.name.givenName, 
                                        lastName:profile.name.familyName, 
                                        email:profile.emails[0].value})

      done(null,user)
    }
  }
));

passport.serializeUser(function(user, done) {
  try{
    done(null,user.google_id)
  }catch(err){
    done(err)
  }
  
});

passport.deserializeUser(async function(id, done) {

  try{
    const user = await User.get(id)
    console.log('in deserializer', user)
    done(null,user)
  }catch(err){
    done(err)
  }
});

module.exports = passport;