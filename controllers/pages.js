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
  let { source } = req.query || "";
  if (source == 'free-video' || source == 'register') {
    return res.render("landing/index", {
      title: "Gerakan Anak Muda Sukses",
      layout: "layouts/landing",
      user: req.user,
      message: "Berhasil mendaftar!"
    });
  }
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
            createdAt: new Date().toLocaleString()
          }
        }
      });
    console.log(newLead);
    // if (funnel == 'billing') { //Jika LP Billing Form
    //   //Buat akun user

    // }
    res.redirect('/');

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
            funnel: funnel,
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
                <p> Silahkan lakukan pembayaran order anda sebelum ${new Date(batasBayar).toLocaleString()} agar Order anda tidak kami batalkan otomatis oleh sistem. </p>
                <p> Silahkan transfer pembayaran total tagihan anda ke rekening berikut : </p>
                <ul>
                  <li> GAMS : BCA a.n DENNIS GERALDI 8480216203 </li>
                  <li> GAMS: MANDIRI a.n DENNIS GERALDI 132-00-2284551-6 </li>
                </ul>
                <p> Setelah melakukan pembayaran jangan lupa untuk mengunggah bukti pembayaran anda melalui tautan berikut </p>
                <a href="${process.env.APP_URL}/upload-receipt/${savedUser._id}"> Upload Bukti Pembayaran </a>
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