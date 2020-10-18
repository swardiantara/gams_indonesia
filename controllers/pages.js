const User = require("../models/user");
const Welcomepage = require("../models/welcome");


exports.getIndex = (req, res) => {
  Welcomepage.find()
  .then((data) => {
    return res.render("index", {
      title: "Gams Indonesia",
      data: data,
      user: req.user,
    });
    // return res.render("index", {
    //   title: "Dashboard",
    //   data: data,
    //   user: req.user,
    //   customjs: true,
    // });
  })
  .catch((err) => {
    console.log(err);
  });
};

exports.getHome = (req, res) => {
  return res.render("landing/index", {
    title: "Gerakan Anak Muda Sukses",
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

exports.getBilling = (req, res) => {
  return res.render("landing/billing", {
    title: "Billing Form",
    layout: "layouts/landing",
    user: req.user
  })
}

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
