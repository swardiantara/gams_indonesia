const User = require("../models/user");
const OrderMembership = require('../models/ordermembership');
const Leads = require('../models/leads');
const moment = require('moment');
exports.getMyLeads = async (req, res) => {
  const userId = req.user._id;
  moment.locale('ID');
  // let date = [];
  User.findById(userId)
    .populate({
      path: "leads",
      options: {
        sort: { createdAt: 'desc' }
      }
    })
    .then((data) => {
      data.leads.tanggal = [];
      for (let i = 0; i < data.leads.length; i++) {
        data.leads[i].tanggal = moment(data.leads[i].createdAt).format('LLLL');
      }

      freevideo = data.leads.filter((item, index) => {
        return item.funnel.includes('freevideo');
      });

      register = data.leads.filter((item, index) => {
        return item.funnel.includes('register');
      });

      return res.render("leads/myleads", {
        title: "My Leads",
        freevideo,
        register,
        user: req.user,
        customjs: true
      });
    });
};

exports.getLeadsPanel = async (req, res) => {
  moment.locale('ID');
  let leads = await Leads.find().sort("-createdAt").populate('referral');
  leads.tanggal = [];
  for (let i = 0; i < leads.length; i++) {
    leads[i].tanggal = moment(leads[i].createdAt).format('LLLL');
  }

  freevideo = leads.filter((item, index) => {
    return item.funnel ? item.funnel.includes('freevideo');
  });

  register = leads.filter((item, index) => {
    return item.funnel ? item.funnel.includes('register');
  });

  return res.render("leads/leadspanel", {
    title: "Leads Panel",
    freevideo,
    register,
    user: req.user,
  });
}
