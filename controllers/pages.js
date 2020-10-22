const User = require("../models/user");
const Welcomepage = require("../models/welcome");
const OrderMembership = require('../models/ordermembership')
const Membership = require('../models/membership')
const crypto = require('crypto');
const transporter = require('../config/mailer')
require("dotenv").config();

exports.getIndex = (req, res) => {
  Welcomepage.find()
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
  return res.render("landing/index", {
    title: "Gerakan Anak Muda Sukses",
    layout: "layouts/landing",
    user: req.user,
  });
};

exports.getFreeVideo = (req, res) => {
  return res.render("landing/free", {
    title: "Free Video",
    layout: "layouts/landing",
    user: req.user,
  });
};

exports.getBilling = (req, res) => {
  return res.render("landing/billing", {
    title: "Billing Form",
    layout: "layouts/landing",
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
  try {
    let { fullName, email } = req.body || "";
    let { referralCode, funnel } = req.query || "";
    let newOrderMembership = new OrderMembership();

    //Simpan data leads
    let newLead = await User.updateOne(
      { referralCode: referralCode },
      {
        $push: {
          leads: {
            fullName: fullName,
            email: email,
            funnel: funnel, //free video atau billing form
            platform: 'GAMS',
            createdAt: new Date()
          }
        }
      });
    console.log(newLead);
    // if (funnel == 'billing') { //Jika LP Billing Form
    //   //Buat akun user

    // }
    res.redirect('/', {
      message: req.flash("success", "Berhasil mendaftar")
    });

  } catch (error) {
    res.redirect('/', {
      error,
      message: req.flash("errorMessage", "Terjadi kesalahan")
    });
  }
  //Billing Form

  // Query update leads
  // Query order membership
  // Kirim email invoice
  // }
  // newFreeVideo.nama = nama;
  // newFreeVideo.email = email;

  // newFreeVideo.save((err) => {
  //   if(err) console.log(err);
  // });

  // //Sukses query
  // // Kirim email ke pemohon

  // return res.redirect('/');
};

exports.postBilling = async (req, res) => {
  try {
    let { fullName, email, city, phone } = req.body || "";
    // console.log(fullName);
    // console.log(email);
    // console.log(city);
    // console.log(phone);
    let { referralCode, funnel } = req.query || "";
    let newLead = await User.updateOne(
      { referralCode: referralCode },
      {
        $push: {
          leads: {
            fullName: fullName,
            email: email,
            funnel: funnel, //free video atau billing form
            platform: 'GAMS',
            createdAt: new Date().toLocaleString()
          }
        }
      });
    // console.log(newLead);

    let newOrderMembership = new OrderMembership();
    let newUser = new User();
    newUser.email = email;
    newUser.city = city;
    newUser.phone = phone;
    // newUser.password = newUser.generateHash(crypto.randomBytes(8).toString('hex'));
    newUser.password = crypto.randomBytes(10).toString('hex');
    newUser.fullName = fullName;
    newUser.referralCode =
      fullName.substr(0, 3) + Math.random().toString().substr(2, 4);
    let savedUser = await newUser.save();
    // console.log(savedUser)
    let membership = await Membership.findOne({ name: 'Basic' });
    // console.log(membership)
    //Order Membership Basic
    newOrderMembership.paket = membership._id;
    newOrderMembership.user = savedUser._id;
    let hasilNewOrderMembership = await newOrderMembership.save();
    // console.log(hasilNewOrderMembership);
    // let sekarang = new Date().getTime() + 2 * 24 * 60 * 60;
    const now = new Date();
    let batasBayar = now.setDate(now.getDate() + 2);

    if (hasilNewOrderMembership) {
      //Kirim email
      const mailOptions = {
        from: process.env.MAIL_UNAME,
        to: savedUser.email,
        subject: "Pendaftaran Membership GAMS Indonesia",
        html: `<html><body>
                Batas Pembayaran ${new Date(batasBayar).toLocaleString()} <br/>
                Nominal bayar ${'Rp. 250.' + Math.random().toString().substr(2, 3)}<br/>
                Klik link di bawah ini untuk konfirmasi pembayaran: <br/>
                <p><a href='${process.env.APP_URL}/upload-receipt/${savedUser._id}'>Konfirmasi Pembayaran</a></p>
                Terima kasih
                <br/><br/>
                </body></html>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log(error);
        console.log("Email sent: " + info.response);
      });
    }

    return res.render('index', {
      message: req.flash("success", "Berhasil mendaftar")
    });

  } catch (error) {
    console.log(error)
    return res.render('index', {
      error,
      message: req.flash("errorMessage", "Terjadi kesalahan")
    });
  }
}