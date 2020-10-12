const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const shortid = require("shortid");

module.exports = (passport) => {
  // Passport serialize and unserialize users out of session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  /**
   * Signup Method
   */

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        //Override default passport using email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        process.nextTick(() => {
          // find a user whose email is the same as the forms email
          User.findOne({ email: email }, (err, user) => {
            if (err) return done(err);

            if (user) {
              return done(
                null,
                false,
                req.flash("signupMessage", "Email ini sudah pernah terdaftar")
              );
            } else {
              const { fullName } = req.body;
              // if there is no user with that email, create the user
              const newUser = new User();

              // set the user's credentials
              newUser.email = email;
              newUser.password = newUser.generateHash(password);
              newUser.fullName = fullName;
              newUser.referralCode =
                fullName.substr(0, 3) + Math.random().toString().substr(2, 4);

              // save the user
              newUser.save((err) => {
                if (err) throw err;

                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  /**
   * Login
   */

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        // find a user whose email is the same as the forms email
        User.findOne({ email: email }, (err, user) => {
          if (err) return done(err);

          if (!user)
            return done(
              null,
              false,
              req.flash(
                "loginMessage",
                "Email atau password yang Anda masukan salah"
              )
            );

          if (!user.validPassword(password))
            return done(
              null,
              false,
              req.flash("loginMessage", "Password yang Anda masukan salah")
            );

          //all is well, return successful user
          return done(null, user);
        });
      }
    )
  );
};
