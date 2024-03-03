const express = require('express')
const passport = require('../middleware/GoogleAuth')

const router = express.Router()

const CLIENT_HOME_PAGE_URL = process.env.CLIENT_HOME_PAGE_URL;


router.get("/redirect/client", (req,res)=>{
    res.redirect(CLIENT_HOME_PAGE_URL)
})

router.get('/login/federated/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt:'select_account' }));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: "/redirect/client",
    failureRedirect: '/'
}));

router.post('/logout', function(req, res, next) {
  try{
    console.log(req.session)
      req.logout((err)=>{
        if(err) return next(err)
        return res.json({msg: "User Logged Out"})  
      
  });

  }catch(err){
    console.log(err)
    next(err)
  }

});

router.get('/login/success', (req, res, next)=>{
  console.log(req.session)
  if (req.user) {
    res.json({
     message : "User Authenticated",
    user : req.user
   })
  }
  else res.status(400).json({
    message : "User Not Authenticated",
  user : null
  })
})
module.exports = router;