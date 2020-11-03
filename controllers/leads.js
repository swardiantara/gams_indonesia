const User = require("../models/user");
const OrderMembership = require('../models/ordermembership');
const moment = require('moment');
exports.getMyLeads = async (req, res) => {
  try {
    let idUser = req.user._id || "";
    let data = User.find().populate('leads')
    let user = await OrderMembership.distinct('user');

    return res.render("leads/leadspanel", {
      title: "Leads Panel",
      data: data,
      user: req.user,
    });

  } catch (error) {
    return res.render("leads/leadspanel", {
      title: "Leads Panel",
      // data: data,
      user: req.user,
    });
  }

};

exports.getLeadsPanel = (req, res) => {
  const userId = req.user._id;
  moment.locale('ID');
  // let date = [];
  User.findOne({ _id: userId })
    .populate("leads")
    .then((data) => {
      // console.log(data);
      data.leads.tanggal = [];
      // console.log(data.leads.length);
      // console.log(data);
      for (let i = 0; i < data.leads.length; i++) {
        // let date = new Date(data.leads[i].createdAt)
        // date.push(moment(data.leads[i].createdAt).format('LLLL'))
        // data.leads[i].createdAt = moment(date).format('LLLL');
        data.leads[i].tanggal = moment(data.leads[i].createdAt).format('LLLL');
        console.log(data.leads[i]);
      }
      return res.render("leads/myleads", {
        title: "My Leads",
        data: data,
        user: req.user,
      });
    });
}
