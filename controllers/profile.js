const User = require("../models/user");
const user = require("../models/user");
const uploadFotoProfile = require("../config/storage");

exports.getEdit = (req, res) => {
  const userId = req.user._id;
  User.findById({ _id: userId })
    .then((userData) => {
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
  console.log(fotoProfile);

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
