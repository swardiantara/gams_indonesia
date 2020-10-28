const User = require("../models/user");
const user = require("../models/user");
const uploadFotoProfile = require("../config/storage");

exports.getEdit = (req, res) => {
  const userId = req.user._id;
  User.findById({ _id: userId })
    .then((userData) => {
      console.log(userData)
      return res.render("profile/edit", {
        title: "Edit Profile",
        data: userData,
        dataFotoProfile: userData.fotoProfile,
        user: req.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditSandi = (req, res) => {
  return res.render("profile/editSandi", {
    title: "Ubah Kata Sandi",
    // data: userData,
    // dataFotoProfile: userData.fotoProfile,
    user: req.user,
    customjs: true
  });
}

/**
 * POST Method
 */

exports.postEdit = (req, res) => {
  const userId = req.user._id;
  const {
    fullName,
    noKtp,
    phone,
    city,
    province,
    postalCode,
    address,
  } = req.body;
  const fotoProfile = req.file ? req.file.path : null;

  User.findById({ _id: userId }).then((userData, err) => {
    if (err) console.log(err);

    if (userData) {
      userData.fullName = fullName;
      userData.phone = phone;
      userData.noKtp = noKtp;
      userData.province = province;
      userData.city = city;
      userData.postalCode = postalCode;
      userData.address = address;
      if (req.file) {
        userData.fotoProfile = fotoProfile;
      }

      userData.save((err) => {
        if (err) console.log(err);
      });

      return res.redirect("/profile/edit");
    }
  });
};

exports.postEditBank = (req, res) => {
  const userId = req.user._id;
  const { bankAccount, bankName, bankNumber } = req.body;

  User.findById({ _id: userId }).then((userData, err) => {
    if (err) console.log(err);

    if (userData) {
      userData.bankAccount = bankAccount;
      userData.bankName = bankName;
      userData.bankNumber = bankNumber;

      userData.save((err) => {
        if (err) console.log(err);
      });

      return res.redirect("/profile/edit");
    }
  });
};

exports.postEditSandi = (req, res) => {
  try {
    const userId = req.user._id;
    const { password, newPassword, confirmPassword } = req.body;

    User.findById({ _id: userId }).then((userData, err) => {
      if (err) console.log(err);
      if (!userData) {
        req.flash('error', 'Terjadi kesalahan.')
        return res.render("profile/editSandi", {
          error: 'Terjadi kesalahan',
          user: req.user
        });
      }

      let cekPass = userData.validPassword(password);
      console.log(cekPass)
      if (!cekPass) {
        req.flash('error', 'Password lama tidak cocok.')
        return res.render('profile/editSandi', {
          error: "Password lama salah.",
          user: req.user
        })
      }
      User.findOneAndUpdate({ _id: userId }, {
        password: userData.generateHash(newPassword)
      }
        , {
          useFindAndModify: false
        }, (err, result) => {
          if (err) console.log(err)
          req.flash('success', 'Berhasil mengubah kata sandi.');
          return res.render('profile/editSandi', {
            success: 'Berhasil ubah kata sandi',
            user: req.user
          });
        })
    })
  } catch (error) {
    return res.render("profile/editSandi", {
      error: 'Terjadi kesalahan',
      user: req.user
    });
  }
}
