const Membership = require("../models/membership");
const OrderMembership = require("../models/ordermembership");
const User = require('../models/user');
const transporter = require('../config/mailinfo');
const mongoose = require('mongoose');
const { emailUsed } = require('../services/leads')
require("dotenv").config();

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
  OrderMembership.find({
    status: {
      $in: ['Belum Bayar', 'Menunggu Konfirmasi Pembayaran']
    }
  })
    .populate("user")
    .populate("paket")
    .then((data) => {
      console.log(data);
      return res.render("membership/orderlist", {
        title: "Order Membership",
        data: data,
        user: req.user,
        customjs: true
      });
    });
};

exports.getMemberCommission = (req, res) => {
  let user = req.user;
  console.log(user.referralComission);
  let referralCommision = user.referralComission.reduce(function (prev, cur) {
    return prev + cur.jumlah;
  }, 0);
  console.log(referralCommision);

  res.render("membership/membercommission", {
    title: "Member Commission",
    user: req.user,
    commission: {
      referral: referralCommision
    },
    customjs: true
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
  let idUser = req.params.id;
  console.log(idUser);
  let order = await OrderMembership.findOne({ user: req.params.id });
  console.log(order);
  let buktiBayar = req.file ? req.file.path : null;
  order.receipt = buktiBayar;
  order.status = "Menunggu Konfirmasi Pembayaran";
  let result = await order.save();
  console.log(result);

  res.redirect('/?upload=success');
}

exports.postVerifikasi = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    let idUser = req.params.id || "";

    console.log(idUser)
    //Ubah Status menjadi Sudah Bayar
    let orderMembership = await OrderMembership.findOne({ user: idUser }).populate("user")
      .populate("paket");
    console.log(orderMembership);
    orderMembership.status = 'Sudah Bayar';
    await orderMembership.save();

    //Beri Komisi ke Upline
    let upline = await (await User.findOne({ referralCode: orderMembership.referralCode })).populated("license");
    let isPremium = upline.license.some((license) => {
      return license.name == 'Premium'
    })

    console.log(isPremium)
    // let komisi = orderMembership.paket.commission;
    upline.referralComission.push({
      type: orderMembership.paket.name,
      jumlah: isPremium ? 100000 : 50000,
      createdAt: new Date().toLocaleString()
    })
    await upline.save()

    //Enkrip password user
    let membership = await Membership.findOne({ name: 'Basic' })
    let user = await User.findById(idUser);
    user.license.push(membership._id)

    //Kirim email akun berhasil dibuat
    const mailOptions = {
      from: `"GAMS Indonesia" <${process.env.MAIL_INFO_UNAME}>`,
      to: user.email,
      subject: `[Aktivasi Akun] - Akun ${process.env.APP_URL} anda telah aktif!`,
      html: `<html><body>
              <p>Hi, ${user.fullName}</p>
              <p>Terimakasih sudah bergabung di ${process.env.APP_URL}.</p>
              <p>Akun Member GAMS Anda:</p>
              Silah login melalui tautan >>> <a href="${process.env.APP_URL}/auth/login/first">ini</a>
              <table>
                <tr>
                  <td> Username  </td>
                  <td> : </td>
                  <td> ${user.email} </td>
                </tr>
                <tr>
                  <td> Password </td>
                  <td> : </td>
                  <td> ${user.password} </td>
                </tr>
              </table>
              <p>*Segera ubah kata sandi setelah login
              <p> Silahkan Follow official instagram GAMS untuk dapat info terbaru seputar gamsindonesia >>> <a href="https://www.instagram.com/gamsindonesia/"> klik disini </a> </p>
  
              <p> Silahkan Subscribe Channel Youtube GAMS untuk dapat mengakses video-video training center kami >>> <a href="https://www.youtube.com/channel/UCgx1vGt-9jR--a0vjw8VTTg"> klik disini </a> </p>
              <p> Salam Dahsyat, </p>
              <p> Generasi Anak Muda Sukses </p>
              </body></html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) console.log(error);
      console.log("Email sent: " + info.response);
    });

    let encrypted = await user.generateHash(user.password);
    user.password = encrypted;
    await user.save();

    //Commit Transaction
    await session.commitTransaction();
    //Send Response
    req.flash('success', 'Berhasil verifikasi pembayaran')
    return res.redirect('/membership/order/panel?successVerif=true');
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    req.flash('error', 'Terjadi Kesalahan')
    return res.redirect('/membership/order/panel?successVerif=false');
  }
}