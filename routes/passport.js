const passport = require("passport");
const express = require("express");
const router = express.Router();

const { isAuthenticated, isUnAuthenticated } = require("../config/protected");

const { getLogin, getSignup, getLogout } = require("../controllers/pages");

module.exports = (passport) => {
  /**
   * GET Method
   */
  router.get("/login", isUnAuthenticated, getLogin);
  router.get("/login/first", isUnAuthenticated, getLogin);
  router.get("/signup", isUnAuthenticated, getSignup);
  router.get("/logout", isAuthenticated, getLogout);

  /**
   * POST Method
   */

  router.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/",
      failureRedirect: "/auth/signup",
      failureFlash: true,
    })
  );

  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/dashboard",
      failureRedirect: "/auth/login",
      failureFlash: true,
    })
  );

  router.post(
    "/login/first",
    passport.authenticate("local-login", {
      successRedirect: "/profile/edit/sandi",
      failureRedirect: "/auth/login",
      failureFlash: true,
    })
  );

  return router;
};
