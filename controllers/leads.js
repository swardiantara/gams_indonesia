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

      let freevideo = data.leads.filter((item, index) => {
        // console.log(item.funnel)
        if (item.funnel) return item.funnel.includes('freevideo');
      });

      let register = data.leads.filter((item, index) => {
        if (item.funnel) return item.funnel.includes('register');
      });

      let tanpaFunnel = data.leads.filter((item) => {
        return item.funnel = undefined;
      })
      // console.log(freevideo)  

      return res.render("leads/myleads", {
        title: "My Leads",
        freevideo,
        register,
        tanpaFunnel,
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

  let freevideo = leads.filter((item, index) => {
    // console.log(item);
    if (item.funnel) {
      return item.funnel.includes('freevideo');
    }
  });

  let register = leads.filter((item, index) => {
    if (item.funnel) {
      return item.funnel.includes('register');
    }
  });

  let tanpaFunnel = leads.filter((item) => {
    return item.funnel = undefined;
  })

  return res.render("leads/leadspanel", {
    title: "Leads Panel",
    freevideo,
    register,
    tanpaFunnel,
    user: req.user,
  });
}
