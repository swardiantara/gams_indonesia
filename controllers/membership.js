const Membership = require("../models/membership");
const OrderMembership = require("../models/ordermembership");
const User = require('../models/user');
const transporter = require('../config/mailinfo');
const transporterBilling = require('../config/mailer');
const mongoose = require('mongoose');
const moment = require('moment');
const { emailUsed } = require('../services/leads')
require("dotenv").config();

/**
 * GET Method
 */

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

exports.getMemberOrder = async (req, res) => {
  // let user = req.user;
  let user = await User.findById(req.user._id);
  let premium = user.license == 'Premium' ? true : false;
  let pendingPremium = "";
  if (user.license != 'Premium') {
    pendingPremium = await OrderMembership.findOne({ user: user._id, status: { $in: ['Menunggu Konfirmasi Pembayaran', 'Belum Bayar'] } });
  }

  return res.render("membership/order", {
    title: "My Membership",
    user: req.user,
    premium,
    pending: pendingPremium ? true : false,
    basic: premium || pendingPremium ? false : true,
    customjs: true
  });
};

exports.getMemberOrderList = (req, res) => {
  moment.locale('ID');
  OrderMembership.find({
    status: {
      $in: ['Belum Bayar', 'Menunggu Konfirmasi Pembayaran']
    }
  }).sort('-createdAt')
    .populate("user")
    .populate("paket")
    .then((data) => {
      data.map((item) => {
        if (Math.floor(Math.abs(new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24)) > 2) {
          // console.log(true)
          return item.kadaluarsa = true;
        }
      })
      data.map((item) => {
        return item.tanggal = moment(item.createdAt).format('LLLL');
      })
      // await data.save();
      // console.log(data)
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
  let total = user.commission.reduce((prev, cur) => {
    return cur.status == 'not_paid' ? prev + cur.jumlah : prev + 0;
  }, 0)
  let revenue = user.commission.reduce((prev, cur) => {
    return prev + cur.jumlah;
  }, 0)
  let referralCommission = user.commission.reduce(function (prev, cur) {
    return cur.type == 'referral' && cur.status == 'not_paid' ? prev + cur.jumlah : prev + 0;
  }, 0);
  let personalCommission = user.commission.reduce(function (prev, cur) {
    return cur.type == 'personal' && cur.status == 'not_paid' ? prev + cur.jumlah : prev + 0;
  }, 0);
  let teamCommission = user.commission.reduce(function (prev, cur) {
    return cur.type == 'team' && cur.status == 'not_paid' ? prev + cur.jumlah : prev + 0;
  }, 0);

  let newMember = user.commission.filter((item, index) => {
    return item.type == 'referral' && item.status == 'not_paid';
  });

  res.render("membership/membercommission", {
    title: "Member Commission",
    user: req.user,
    commission: {
      referral: referralCommission,
      personal: personalCommission,
      team: teamCommission,
      revenue,
      total,
      newMember: newMember.length,
    },
    customjs: true
  });
};

exports.getUploadReceipt = async (req, res) => {
  let { referralCode, funnel } = req.query || "";
  let order = await OrderMembership.findOne({ user: req.params.id, status: 'Menunggu Konfirmasi Pembayaran' });

  if (order) {
    res.redirect(`/${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`);
  }
  res.render("membership/uploadreceipt", {
    title: "Upload Bukti Bayar",
    customjs: true,
    layout: 'layouts/auth'
  });
}

exports.getUploadPremium = async (req, res) => {
  let order = await OrderMembership.findOne({ user: req.params.id, status: 'Menunggu Konfirmasi Pembayaran' });
  if (order) {
    res.redirect(`/dashboard`);
  }
  res.render("membership/uploadpremium", {
    title: "Upload Bukti Bayar",
    customjs: true,
    user: req.user
    // layout: 'layouts/landing'
  });
}


exports.getCommisionDetail = async (req, res) => {
  if (req.user.role != 'Admin') {
    return res.redirect('/dashboard');
  }
  // let loggedInUser = await User.findById(req.user._id).populate('license');
  // // user.license = user.license.some(license => {
  // //   return license.name == 'Premium'
  // // }) ? 'Premium' : 'Basic';
  // loggedInUser.license = loggedInUser.license.some(item => {
  //   return item.name == 'Premium'
  // }) ? 'Premium' : 'Basic';
  // console.log(loggedInUser.license)
  moment.locale('ID');
  let userId = req.params.id || "";
  let user = await User.findById(userId).populate('commission');
  // console.log(user);
  user.commission.map(commission => {
    return commission.createdAt = moment(commission.createdAt).format('LLLL');
  })
  user.commission = user.commission.filter(commission => {
    return commission.status == 'not_paid'
  })
  let total = user.commission.reduce((prev, cur) => {
    return cur.status == 'not_paid' ? prev + cur.jumlah : prev + 0;
  }, 0)
  console.log(total)
  return res.render("membership/commissiondetail", {
    title: "Commission List",
    data: user,
    user: req.user,
    total,
    customjs: true
  });
}

exports.getDownlineDetail = async (req, res) => {
  if (req.user.role != 'Admin') {
    return res.redirect('/dashboard');
  }

  moment.locale('ID');
  let userId = req.params.id || "";
  let user = await User.findById(userId).populate({ path: 'downline' });
  user.downline = user.downline.filter((item, index) => {
    return item.role == 'Member'
  })
  // user.downline.map((item, index) => {
  //   // item.license = item.populate('license');
  //   // item.license.some(license => {
  //   //   return license.name == 'Premium'
  //   // })
  //   // console.log(item.license)
  //   return item.license = item.license.some(license => {
  //     return license.name == 'Premium'
  //   }) ? 'Premium' : 'Basic';
  // })
  user.downline.map((item, index) => {
    let total = item.commission.reduce((prev, cur) => {
      return cur.status == 'not_paid' ? prev + cur.jumlah : prev + 0;
    }, 0)
    return item.komisi = total;
    // console.log(item.komisi);
  })

  return res.render("membership/downline", {
    title: "Team Member",
    data: user.downline,
    user: req.user,
    namaUpline: user.fullName
  });
}

/**
 * POST Method
 */

exports.postAddMembership = (req, res) => {
  let user = req.user;
  const { name, description, price, commission } = req.body;
  let premium = user.license == 'Premium';

  if (premium) {
    res.send(400).send({ message: 'Anda sudah member Premium!' })
  }

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

exports.postOrderMembership = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    let userId = req.user._id;
    let user = req.user;
    let { paket } = req.body;
    let sudah = user.license == 'Premium' ? true : false;

    if (sudah) {
      await session.abortTransaction();
      res.status(404).send({ message: 'Anda sudah member premium!' })
    }

    let belumBayar = await OrderMembership.findOne({ user: user._id, status: 'Belum Bayar' });
    if (belumBayar) {
      await session.abortTransaction();
      res.status(404).send({ message: 'Silahkan lakukan pembayaran terlebih dahulu!' })
    }

    let pendingPremium = await OrderMembership.findOne({ user: user._id, status: 'Menunggu Konfirmasi Pembayaran' });
    if (pendingPremium) {
      await session.abortTransaction();
      res.status(404).send({ message: 'Membership premium anda sedang diproses!' })
    }

    paket = await Membership.findOne({ name: paket });
    if (!paket) {
      await session.abortTransaction();
      res.status(404).send({ message: 'Paket tidak ditemukan!' })
    }

    let newOrder = new OrderMembership();
    newOrder.user = userId;
    newOrder.paket = paket._id;
    newOrder.status = "Belum Bayar";

    let saveOrder = await newOrder.save();
    if (!saveOrder) {
      await session.abortTransaction();
      res.status(400).send({ message: "Terjadi kesalahan, hubungi Admin!" })
    }
    //Berhasil membuat Order Membership, kirim email order
    moment.locale('ID');
    const now = new Date();
    let batasBayar = now.setDate(now.getDate() + 2);
    let formatted = moment(batasBayar).format('LLLL');

    const mailOptions = {
      from: `"GAMS Indonesia" <${process.env.MAIL_UNAME}>`,
      to: user.email,
      subject: "Upgrade Membership GAMS Indonesia",
      html: `<html><body>
              <p>Hi, ${user.fullName}</p>
              <p>Terimakasih sudah melakukan Upgrade Membership ${process.env.APP_URL}.</p>
              <p>Anda telah melakukan order dengan detail berikut:</p>
              <table>
                <tr>
                  <td> Nama </td>
                  <td> : </td>
                  <td> ${user.fullName} </td>
                </tr>
                <tr>
                  <td> Email </td>
                  <td> : </td>
                  <td> ${user.email} </td>
                </tr>
                <tr>
                  <td> No. HP </td>
                  <td> : </td>
                  <td> ${user.phone} </td>
                </tr>
              </table>
              <p> Total tagihan anda adalah : ${'Rp. 500.' + Math.random().toString().substr(2, 3)} </p>
              <p> Silahkan lakukan pembayaran order anda sebelum ${formatted} agar Order anda tidak kami batalkan otomatis oleh sistem. </p>
              <p> Silahkan transfer pembayaran total tagihan anda ke rekening berikut : </p>
              <ul>
                <li> GAMS : BCA a.n DENNIS GERALDI 8480216203 </li>
                <li> GAMS : MANDIRI a.n DENNIS GERALDI 132-00-2284551-6 </li>
              </ul>
              <p> Setelah melakukan pembayaran jangan lupa untuk mengunggah bukti pembayaran anda melalui tautan berikut </p>
              <a href="${process.env.APP_URL}/upload-premium/${user._id}"> Upload Bukti Pembayaran </a>
              <p> Setelah mengunggah bukti pembayaran, pastikan anda melakukan konfirmasi pembayaran agar akses Anda ke Member Area bisa segera diproses melalui link berikut </p>
              <a href="https://api.whatsapp.com/send?phone=6283877607433&text=Saya%20mau%20konfirmasi%20bukti%20bayar%20upgrade%20membership%20GAMS"> Konfirmasi Pembayaran </a>
              <p> Salam Dahsyat, </p>
              <p> Generasi Anak Muda Sukses </p>
              </body></html>`,
    };

    transporterBilling.sendMail(mailOptions, function (error, info) {
      if (error) console.log(error);
      console.log("Email sent: " + info.response);
    });

    res.status(200).send({ message: 'success' });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).send({ message: "Terjadi kesalahan, hubungi Admin!" })
  }
};



exports.postUploadReceipt = async (req, res) => {
  // let idUser = req.params.id;
  let { referralCode, funnel } = req.query || "";
  let order = await OrderMembership.findOne({ user: req.params.id, status: 'Belum Bayar' });
  let buktiBayar = req.file ? req.file.path : null;
  order.receipt = buktiBayar;
  order.status = "Menunggu Konfirmasi Pembayaran";
  let result = await order.save();

  res.redirect(`/${referralCode ? "?referralCode=" + referralCode : ""}${funnel ? "&funnel=" + funnel : ""}`);
}

exports.postUploadPremium = async (req, res) => {
  // let idUser = req.params.id;
  // let { referralCode, funnel } = req.query || "";
  // console.log(idUser);
  let order = await OrderMembership.findOne({ user: req.params.id, status: 'Belum Bayar' });
  // console.log(order);
  let buktiBayar = req.file ? req.file.path : null;
  order.receipt = buktiBayar;
  order.status = "Menunggu Konfirmasi Pembayaran";
  let result = await order.save();
  // console.log(result);

  res.redirect(`/dashboard`);
}

exports.postVerifikasi = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let idUser = req.params.id || "";
    // console.log(idUser) //1
    //Ubah Status menjadi Sudah Bayar
    let orderMembership = await OrderMembership.findOne({ user: idUser, status: 'Menunggu Konfirmasi Pembayaran' }).populate("user")
      .populate("paket");
    // console.log(orderMembership); //2
    orderMembership.status = 'Sudah Bayar';
    let ubahStatus = await orderMembership.save();
    if (!ubahStatus) {
      await session.abortTransaction();
      req.flash('error', 'Terjadi kesalahan!')
      return res.redirect(`/membership/order/panel?successVerif=false`)
    }

    if (orderMembership.referralCode) {
      //Beri Komisi ke Upline
      let upline = await User.findOne({ referralCode: orderMembership.referralCode });
      let isPremium = upline.license == 'Premium' ? true : false;


      //daftarkan downline ke upline
      upline.downline.push(idUser)

      // console.log(isPremium) //3
      // let komisi = orderMembership.paket.commission;
      upline.commission.push({
        type: 'referral',
        jumlah: isPremium ? 100000 : 50000,
        status: 'not_paid',
        createdAt: new Date().toLocaleString()
      })
      let komisi = await upline.save();

      if (!komisi) {
        await session.abortTransaction();
        req.flash('error', 'Terjadi kesalahan!')
        return res.redirect(`/membership/order/panel?successVerif=false`)
      }
    }

    if (orderMembership.paket.name == 'Basic') {
      //Tambahkan license ke User
      let user = await User.findById(idUser);
      user.role = 'Member';
      user.license = 'Basic';
      //Kirim email akun berhasil dibuat
      const mailOptions = {
        from: `"GAMS Indonesia" <${process.env.MAIL_INFO_UNAME}>`,
        to: user.email,
        subject: `[Aktivasi Akun] - Akun ${process.env.APP_URL} anda telah aktif!`,
        html: `<html><body>
                <p>Hi, ${user.fullName}</p>
                <p>Terimakasih sudah bergabung di ${process.env.APP_URL}.</p>
                <p>Akun Member GAMS Anda:</p>
                <p>Silah login melalui tautan >>> <a href="${process.env.APP_URL}/auth/login/first">${process.env.APP_URL}/auth/login</a></p>
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
      let simpanUser = await user.save();

      if (!simpanUser) {
        await session.abortTransaction();
        req.flash('error', 'Terjadi kesalahan!')
        return res.redirect(`/membership/order/panel?successVerif=false`)
      }
    } else {
      //Tambahkan license ke User
      let user = await User.findById(idUser);
      user.license = 'Premium';
      const mailOptions = {
        from: `"GAMS Indonesia" <${process.env.MAIL_INFO_UNAME}>`,
        to: user.email,
        subject: `[Berhasil] - Upgrade Membership GAMS Indonesia!`,
        html: `<html><body>
                <p>Hi, ${user.fullName}</p>
                <p>Terimakasih sudah melakukan upgrade membership akun anda di ${process.env.APP_URL}</p>
                <p>Akun Membership Premium GAMS Anda telah aktif :</p>
                <p>Login di >>> <a href="${process.env.APP_URL}/auth/login">${process.env.APP_URL}/auth/login</a></p>
                
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

      let simpanUser = await user.save();

      if (!simpanUser) {
        await session.abortTransaction();
        req.flash('error', 'Terjadi kesalahan!')
        return res.redirect(`/membership/order/panel?successVerif=false`)
      }
    }

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

exports.resetCommission = async (req, res) => {
  try {
    let idUser = req.params.id || "";
    let user = await User.findById(idUser).populate({
      path: 'commission',
      match: {
        status: 'not_paid'
      }
    });
    // console.log(user.commission);
    // return res.status(400).send({ code: 400, message: 'Gagal mereset komisi!', data: user })
    user.commission.map(item => {
      if (item.status = 'not_paid') return item.status = 'paid'
    })

    let saved = await user.save();
    if (!saved) {
      return res.status(400).send({ code: 400, message: 'Gagal mereset komisi!' })
    }
    return res.status(200).send({ code: 200, message: 'Berhasil mereset komisi' })
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: 'Internal server Error',
      error
    })
  }
}

exports.deleteOrderMembership = async (req, res) => {
  try {
    let idOrder = req.params.id || null;
    OrderMembership.findById({ _id: idOrder }).then((dataOrder) => {
      dataOrder.remove();
      return res.status(200).send({ message: 'success' })
    }).catch(err => {
      res.send(err)
    });
  } catch (error) {
    res.send(error)
  }
}
