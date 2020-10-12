const User = require("../models/user");
const user = require("../models/user");
const Welcomepage = require("../models/welcome");

exports.editDashboard = (req, res) => {
  res.render("dashboard/edit-dashboard", {
    title: "Add Article to Welcome",
    user: req.user,
    customjs: true,
  });
};

exports.postDashboard = (req, res) => {
  const { titlePage, descriptionPage } = req.body;
  console.log(req.body);
  const newWelcome = new Welcomepage();

  newWelcome.titlePage = titlePage;
  newWelcome.descriptionPage = descriptionPage;
  newWelcome.user = req.user._id;
  newWelcome.dateCreated = new Date("<YYYY-mm-ddTHH:MM:ss>");

  newWelcome.save((err, done) => {
    if (err) {
      console.log(err);
    }
    if (done) {
      return res.redirect("/dashboard");
    }
  });
};

exports.getDashboard = (req, res) => {
  Welcomepage.find()
    .then((data) => {
      return res.render("index", {
        title: "Dashboard",
        data: data,
        user: req.user,
        customjs: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
