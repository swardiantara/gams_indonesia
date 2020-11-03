const User = require("../models/user");

exports.getMemberlist = (req, res) => {
  User.find().populate('license').then((data) => {
    data = data.filter((item, index) => {
      return item.role == 'Member'
    })

    return res.render("memberlist/index", {
      title: "Leads Panel",
      data: data,
      user: req.user,
    });
  });
};
