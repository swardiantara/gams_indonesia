const Membership = require("../models/membership");
const OrderMembership = require("../models/ordermembership");

exports.getMembership = (req, res) => {
  Membership.find().then((dataMembership) => {
    return res.render("membership/index", {
      title: "Membership",
      data: dataMembership,
      user: req.user,
    });
  });
};

exports.getAddMembership = (req, res) => {
  return res.render("membership/add", {
    title: "Add Membership",
    user: req.user,
    customjs: true,
  });
};

exports.getEditMembership = (req, res) => {
  const membershipId = req.params.id;

  Membership.findById({ _id: membershipId }).then((dataMembership) => {
    return res.render("membership/add", {
      title: "Edit Membership",
      data: dataMembership,
      user: req.user,
      customjs: true,
    });
  });
};

exports.getMemberOrder = (req, res) => {
  return res.render("membership/order", {
    title: "My Membership",
    user: req.user,
  });
};

exports.getMemberOrderList = (req, res) => {
  OrderMembership.find()
    .populate("user")
    .populate("paket")
    .then((data) => {
      console.log(data);
      return res.render("membership/orderlist", {
        title: "Order Membership",
        data: data,
        user: req.user,
      });
    });
};

exports.getMemberCommission = (req, res) => {
  res.render("membership/membercommission", {
    title: "Member Commission",
    user: req.user,
  });
};

/**
 * POST Method
 */

exports.postAddMembership = (req, res) => {
  const { name, description, price, commission } = req.body;

  const newMembership = new Membership();
  newMembership.name = name;
  newMembership.description = description;
  newMembership.price = price;
  newMembership.commission = commission;

  newMembership.save((err) => {
    if (err) console.log(err);
  });

  return res.redirect("/membership");
};

exports.postEditMembership = (req, res) => {
  const membershipId = req.params.id;
  const deleteId = req.params.delete;

  const { name, description, price, commission } = req.body;

  if (membershipId) {
    Membership.findById({ _id: membershipId })
      .then((dataMembership) => {
        dataMembership.name = name;
        dataMembership.description = description;
        dataMembership.price = price;
        dataMembership.commission = commission;

        dataMembership.save((err) => {
          if (err) console.log(err);
        });

        return res.redirect("/membership");
      })
      .catch((err) => console.log(err));
  }

  if (deleteId) {
    Membership.findById({ _id: deleteId }).then((dataMembership) => {
      dataMembership.remove();
      return res.redirect("/membership");
    });
  }
};

/**
 * API
 */

exports.getMembershipAPI = (req, res) => {
  Membership.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);

      res.status(400).send({ message: "Error" });
    });
};

exports.postOrderMembership = (req, res) => {
  const userId = req.user._id;
  const { paket } = req.body;

  console.log(req.body);

  const newOrder = new OrderMembership();

  newOrder.user = userId;
  newOrder.paket = paket;
  newOrder.status = "Belum Bayar";

  newOrder.save((err, done) => {
    if (err) {
      console.log(err);
      res.status(400).send({ message: "Error" });
    }

    if (done) {
      res.status(200).send(done);
    }
  });
};

exports.getUploadReceipt = (req, res) => {
  res.render("membership/uploadreceipt", {
    title: "Upload Bukti Bayar",
    // customjs: true,
    layout: 'layouts/landing'
  });
}

exports.postUploadReceipt = async (req, res) => {
  let order = await OrderMembership.findOne({ _id: req.params.id });
  const buktiBayar = req.file ? req.file.path : null;
  order.updateOne({
    receipt: buktiBayar,
    status: "Menunggu Konfirmasi Pembayaran"
  })



}
