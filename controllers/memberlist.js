const User = require("../models/user");

exports.getMemberlist = (req, res) => {
  User.find().then((data) => {
    return res.render("memberlist/index", {
      title: "Leads Panel",
      data: data,
      user: req.user,
    });
  });
};
