require("dotenv").config();
const express = require("express");
console.log(process.env.NODE_ENV);
const passport = require("./middleware/GoogleAuth");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const nhlRoutes = require("./routes/nhlGames");
const NHL_API_Routes = require("./routes/NHL_API");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");

const RS = require("connect-redis").default;

const MockAuth = require("./middleware/MockAuth");

const { NotFoundError } = require("./expressError");

const app = express();

app.use(express.json());
app.use(MockAuth);
app.enable("trust proxy");

//Redis setup
const { redisClient } = require("./middleware/redisClient");

const RedisStore = new RS({
  client: redisClient,
});

app.use(cookieParser());

const productionCookieSettings = {
  secure: true, // if true only transmit cookie over https
  httpOnly: false, // if true prevent client side JS from reading the cookie
  maxAge: 1000 * 60 * 10, // session max age in miliseconds
  sameSite: "none",
};

// configs app to use express-session with RedisStore
app.use(
  session({
    store: RedisStore,
    secret: "secret$%^134",
    resave: false,
    saveUninitialized: false,
    cookie:
      process.env.NODE_ENV === "dev"
        ? { maxAge: 1000 * 60 * 10 }
        : productionCookieSettings,
  }),
);

// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

//allows requests from react client
app.use(
  cors({
    origin: process.env.CLIENT_HOME_PAGE_URL, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  }),
);

//if(process.env.NODE_ENV === 'test') app.use(MockAuth)

app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/nhl", nhlRoutes);
app.use("/nhl-api", NHL_API_Routes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test"); //console.error(err.stack)
  const status = err.status || 500;
  const message = err.message;
  console.log(err.message);
  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
