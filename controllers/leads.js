const User = require("../models/user");

exports.getMyLeads = (req, res) => {
  const userId = req.user._id;

  User.find({ _id: userId })
    .populate("leads")
    .then((data) => {
      console.log(data);
      return res.render("leads/myleads", {
        title: "My Leads",
        data: data,
        user: req.user,
      });
    });
};
