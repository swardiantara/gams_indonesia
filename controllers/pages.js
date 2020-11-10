const User = require("../models/user");
const Welcomepage = require("../models/welcome");
const OrderMembership = require('../models/ordermembership')
const Membership = require('../models/membership')
const Leads = require('../models/leads')
const crypto = require('crypto');
const transporter = require('../config/mailer')
const mongoose = require('mongoose');
const { emailUsed } = require("../services/leads");
require("dotenv").config();
const moment = require('moment')

exports.getIndex = (req, res) => {
  Welcomepage.findOne()
    .then((data) => {
      return res.render("index", {
        title: "Gams Indonesia",
        data: data,
        user: req.user,
      });
      // return res.render("index", {
      //   title: "Dashboard",
      //   data: data,
      //   user: req.user,
      //   customjs: true,
      // });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getHome = (req, res) => {
  let { source } = req.query || "";
  if (source == 'free-video' || source == 'register') {
    return res.render("landing/index", {
      title: "Generasi Anak Muda Sukses",
      layout: "layouts/landing",
      user: req.user,
      message: "Berhasil mendaftar!",
      customjs: true,
    });
  }
  return res.render("landing/index", {
    title: "Generasi Anak Muda Sukses",
    layout: "layouts/landing",
    user: req.user,
  });
};

exports.getFreeVideo = (req, res) => {
  return res.render("landing/free", {
    title: "Free Video",
    layout: "layouts/mylanding",
    user: req.user,
  });
};

exports.getBilling = (req, res) => {
  return res.render("landing/billing", {
    title: "Billing Form",
    layout: "layouts/mylanding",
    user: req.user
  })
}

exports.getLogin = (req, res) => {
  return res.render("login", {
    title: "Login",
    layout: "layouts/auth",
    message: req.flash("loginMessage"),
  });
};

exports.getSignup = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("signup", {
    title: "Signup",
    layout: "layouts/auth",
    message: req.flash("signupMessage"),
  });
};

exports.getLogout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/auth/login");
};

exports.postLeads = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let { fullName, email } = req.body || "";
  let { referralCode, funnel } = req.query || "";

  try {
    if (await emailUsed(email)) {
      await session.abortTransaction();
      req.flash('error', 'Email sudah digunakan!')
      return res.redirect(`/freevideo${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
    }
    let upline;
    if (referralCode) {
      upline = await User.findOne({ referralCode });
      if (!upline) {
        await session.abortTransaction();
        req.flash('error', 'Kode referral yang anda gunakan tidak valid!')
        return res.redirect(`/freevideo${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
      }
    }

    let newLeads = new Leads();
    newLeads.referral = referralCode ? upline._id : "";
    newLeads.email = email;
    newLeads.fullName = fullName;
    newLeads.funnel = funnel;
    newLeads.platform = 'GAMS';
    newLeads.createdAt = new Date().toLocaleString();
    let createdLeads = await newLeads.save();

    if (!createdLeads) {
      await session.abortTransaction();
      req.flash('error', 'Terjadi kesalahan!')
      return res.redirect(`/freevideo${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
    }


    //Simpan data leads di Upline
    upline.leads.push(createdLeads._id);
    let updatedUpline = await upline.save();
    if (updatedUpline instanceof Error) {
      await session.abortTransaction();
      req.flash('error', 'Terjadi kesalahan!')
      return res.redirect(`/freevideo${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
    }

    await session.commitTransaction();
    req.flash('success', 'Berhasil submit form!')
    res.redirect(`/${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`);

  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    req.flash('error', 'Terjadi kesalahan!')
    return res.redirect(`/freevideo${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`);
  }
};

exports.postBilling = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let { fullName, email, city, phone } = req.body || "";
  let { referralCode, funnel } = req.query || "";
  try {
    let upline;
    if (referralCode) {
      upline = await User.findOne({ referralCode });
      if (!upline) {
        await session.abortTransaction();
        req.flash('error', 'Kode referral yang anda gunakan tidak valid!')
        return res.redirect(`/register${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
      }
    }

    //Simpan data ke Leads
    let newLeads = new Leads();
    newLeads.referral = referralCode ? upline._id : "";
    newLeads.email = email;
    newLeads.fullName = fullName;
    newLeads.phone = phone;
    newLeads.funnel = funnel;
    newLeads.platform = 'GAMS';
    newLeads.createdAt = new Date().toLocaleString();
    let createdLeads = await newLeads.save();

    if (!createdLeads) {
      await session.abortTransaction();
      req.flash('error', 'Terjadi kesalahan!')
      return res.redirect(`/register${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
    }

    //Simpan data leads di Upline
    upline.leads.push(createdLeads._id);
    let updatedUpline = await upline.save();
    if (updatedUpline instanceof Error) {
      await session.abortTransaction();
      req.flash('error', 'Terjadi kesalahan!')
      return res.redirect(`/register${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
    }

    //Buat Akun user baru membership basic
    let newUser = new User();
    newUser.email = email;
    newUser.city = city;
    newUser.phone = phone;
    newUser.password = crypto.randomBytes(5).toString('hex');
    newUser.fullName = fullName;
    newUser.referralCode =
      fullName.substr(0, 3) + Math.random().toString().substr(2, 4);
    let savedUser = await newUser.save();

    //Error handling
    if (!savedUser) {
      await session.abortTransaction();
      req.flash('error', 'Terjadi kesalahan!')
      return res.redirect(`/register${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
    }

    let membership = await Membership.findOne({ name: 'Basic' });
    //Order Membership Basic
    let newOrderMembership = new OrderMembership();
    newOrderMembership.paket = membership._id;
    newOrderMembership.user = savedUser._id;
    newOrderMembership.referralCode = referralCode;
    let hasilNewOrderMembership = await newOrderMembership.save();
    if (!hasilNewOrderMembership) {
      await session.abortTransaction();
      req.flash('error', 'Terjadi kesalahan!')
      return res.redirect(`/register${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
    }

    //Format waktu batas bayar
    // let sekarang = new Date().getTime() + 2 * 24 * 60 * 60;
    moment.locale('ID');
    const now = new Date();
    let batasBayar = now.setDate(now.getDate() + 2);
    let formatted = moment(batasBayar).format('LLLL');

    //Kirim email
    const mailOptions = {
      from: `"GAMS Indonesia" <${process.env.MAIL_UNAME}>`,
      to: savedUser.email,
      subject: "Pendaftaran Membership GAMS Indonesia",
      html: `<html><body>
              <p>Hi, ${savedUser.fullName}</p>
              <p>Terimakasih sudah melakukan Pendaftaran Member ${process.env.APP_URL}.</p>
              <p>Anda telah melakukan order dengan detail berikut:</p>
              <table>
                <tr>
                  <td> Nama </td>
                  <td> : </td>
                  <td> ${savedUser.fullName} </td>
                </tr>
                <tr>
                  <td> Email </td>
                  <td> : </td>
                  <td> ${savedUser.email} </td>
                </tr>
                <tr>
                  <td> No. HP </td>
                  <td> : </td>
                  <td> ${savedUser.phone} </td>
                </tr>
              </table>
              <p> Total tagihan anda adalah : ${'Rp. 250.' + Math.random().toString().substr(2, 3)} </p>
              <p> Silahkan lakukan pembayaran order anda sebelum ${formatted} agar Order anda tidak kami batalkan otomatis oleh sistem. </p>
              <p> Silahkan transfer pembayaran total tagihan anda ke rekening berikut : </p>
              <ul>
                <li> GAMS : BCA a.n DENNIS GERALDI 8480216203 </li>
                <li> GAMS : MANDIRI a.n DENNIS GERALDI 132-00-2284551-6 </li>
              </ul>
              <p> Setelah melakukan pembayaran jangan lupa untuk mengunggah bukti pembayaran anda melalui tautan berikut </p>
              <a href="${process.env.APP_URL}/upload-receipt/${savedUser._id}${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}"> Upload Bukti Pembayaran </a>
              <p> Setelah mengunggah bukti pembayaran, pastikan anda melakukan konfirmasi pembayaran agar akses Anda ke Member Area bisa segera diproses melalui link berikut </p>
              <a href="https://api.whatsapp.com/send?phone=6283877607433&text=Saya%20mau%20konfirmasi%20bukti%20bayar%20pendaftaran%20membership%20GAMS"> Konfirmasi Pembayaran </a>
              <p> Salam Dahsyat, </p>
              <p> Generasi Anak Muda Sukses </p>
              </body></html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) console.log(error);
      console.log("Email sent: " + info.response);
    });

    //Commit Transaction
    await session.commitTransaction();
    //Send Response
    req.flash('success', 'Berhasil melakukan pendaftaran!')
    return res.redirect(`/${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`);

  } catch (error) {
    await session.abortTransaction();
    console.log(error)
    req.flash('error', 'Terjadi Kesalahan')
    return res.redirect(`/${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`)
  }
}