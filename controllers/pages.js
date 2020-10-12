const User = require("../models/user");

exports.getIndex = (req, res) => {
  return res.render("index", {
    title: "Gams Indonesia",
    user: req.user,
  });
};

exports.getHome = (req, res) => {
  return res.render("landing/index", {
    title: "Gams Indonesia",
    layout: "layouts/landing",
    user: req.user,
  });
};

exports.getFreeVideo = (req, res) => {
  return res.render("landing/free", {
    title: "Free Video",
    layout: "layouts/landing",
    user: req.user,
  });
};

exports.getLogin = (req, res) => {
  return res.render("login", {
    title: "Login",
    layout: "layouts/auth",
    message: req.flash("loginMessage"),
  });
};

exports.getSignup = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("signup", {
    title: "Signup",
    layout: "layouts/auth",
    message: req.flash("signupMessage"),
  });
};

exports.getLogout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/auth/login");
};
