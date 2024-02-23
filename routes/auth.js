const express = require('express')
const passport = require('../middleware/GoogleAuth')

const router = express.Router()

router.get("/login", (req,res)=>{
    res.render('login')
})

router.get('/login/federated/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/login/success',
    failureRedirect: '/login'
}));

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/login/success', (req, res, next)=>{
    res.redirect('/')
})
module.exports = router;