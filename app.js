require('dotenv').config()
const express = require('express')
const passport = require('./middleware/GoogleAuth')
const authRoutes = require('./routes/auth')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const {COOKIE_KEYS} = require('./config')

const app = express()

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(session({
    secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true
}));
// app.use(
//     cookieSession({
//       name: "session",
//       keys: COOKIE_KEYS,
//       maxAge: 24 * 60 * 60 * 100,
//       cookie: {
//         secure: true,
//         sameSite: 'none'
//       }
//     })
// );

// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

app.use(cookieParser());

// register regenerate & save after the cookieSession middleware initialization
// app.use(function(request, response, next) {
//     console.log(request.session)
//     if (request.session && !request.session.regenerate) {
//         request.session.regenerate = (cb) => {
//             cb()
//         }
//     }
//     if (request.session && !request.session.save) {
//         request.session.save = (cb) => {

//             console.log(cb)
//             cb()
//         }
//     }
//     return next()
// })

//allows requests from react client
app.use(
    cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    })
  );



app.use('/', authRoutes)

app.get('/',(req, res)=>{
    
    
    console.log(req.session)
    console.log(req.user)
    req.session.views = (req.session.views || 0) + 1
   
    return res.end(req.session.views + ' views')

    //res.json({msg:"hello world"})
})

module.exports = app;