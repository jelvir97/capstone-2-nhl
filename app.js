require('dotenv').config()
const express = require('express')
const passport = require('./middleware/GoogleAuth')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const {COOKIE_KEYS} = require('./config')
const isAuthenticated = require('./middleware/isAuthenticated')

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("./expressError");

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
app.use('/users', userRoutes)

app.get('/secret', isAuthenticated, (req, res, next)=>{
    return res.end('You found the secret')
})

app.get('/',(req, res)=>{
   
    return req.user ? res.render('home') : res.end('go to login page')

    //res.json({msg:"hello world"})
})

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
  /** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test"); //console.error(err.stack)
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;