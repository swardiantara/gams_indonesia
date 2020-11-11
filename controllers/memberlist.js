const User = require("../models/user");
const moment = require('moment');

exports.getMemberlist = async (req, res) => {
  moment.locale('ID');
  let user = await User.find().populate('downline').populate('comission').populate('license');
  user = user.filter((item, index) => {
    return item.role == 'Member'
  })
  user.map((item, index) => {
    // item.license.some(license => {
    //   return license.name == 'Premium'
    // })
    // console.log(item.license)
    item.license = item.license.some(license => {
      return license.name == 'Premium'
    }) ? 'Premium' : 'Basic';
  })
  user.map((item, index) => {
    let total = item.commission.reduce((prev, cur) => {
      return cur.status == 'not_paid' ? prev + cur.jumlah : prev + 0;
    }, 0)
    item.komisi = total;
    console.log(item.komisi);
  })
  // let total = user.commission.reduce((prev, cur) => {
  //   return cur.status == 'not_paid' ? prev + cur.jumlah : prev + 0;
  // }, 0)
  return res.render("memberlist/index", {
    title: "Leads Panel",
    data: user,
    user: req.user,
  });
};
