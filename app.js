const createError = require("http-errors");
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dbConnect = require("./config/database");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const passport = require("passport");

const indexRouter = require("./routes/index");
const profileRouter = require("./routes/profile");
const productRouter = require("./routes/product");
const lessonRouter = require("./routes/lesson");
const toolRouter = require("./routes/tool");
const leadsRouter = require("./routes/leads");
const memberlistRouter = require("./routes/memberlist");
const membershipRouter = require("./routes/membership");
const passportRouter = require("./routes/passport")(passport);
const editDashboard = require("./routes/edit-dashboard");

const app = express();

//Load Config
dbConnect();
require("dotenv").config();

// Global middleware access req.user
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

const store = new MongoDBStore({
  uri: process.env.DB,
  collection: "sessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

app.use(
  require("express-session")({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
hbs.registerPartials(__dirname + "/views/partials");
require("./config/helper")(hbs);

// Setup Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use("/", indexRouter);
app.use("/profile", profileRouter);
app.use("/product", productRouter);
app.use("/lesson", lessonRouter);
app.use("/lead", leadsRouter);
app.use("/tool", toolRouter);
app.use("/memberlist", memberlistRouter);
app.use("/membership", membershipRouter);
app.use(membershipRouter);
app.use("/auth", passportRouter);
app.use("/edit-dashboard", editDashboard);
app.use(editDashboard);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
