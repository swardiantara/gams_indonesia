exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/auth/login");
  }
};

exports.isUnAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/dashboard");
  }
};
