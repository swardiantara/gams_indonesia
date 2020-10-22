const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: false,
      default: null,
    },
    role: {
      type: String,
      required: true,
      default: "Member",
    },
    fullName: {
      type: String,
      required: false,
      default: null,
    },
    phone: {
      type: String,
      required: false,
      default: null,
    },
    noKtp: {
      type: String,
      required: false,
      default: null,
    },
    noNpwp: {
      type: String,
      required: false,
      default: null,
    },
    province: {
      type: String,
      required: false,
      default: null,
    },
    city: {
      type: String,
      required: false,
      default: null,
    },
    postalCode: {
      type: String,
      required: false,
      default: null,
    },
    address: {
      type: String,
      required: false,
      default: null,
    },
    license: [
      {
        type: Schema.Types.ObjectId,
        ref: "Membership",
        required: false,
      },
    ],
    referralCode: {
      type: String,
      required: false,
      default: null,
    },
    bankAccount: {
      type: String,
      required: false,
      default: null,
    },
    bankName: {
      type: String,
      required: false,
      default: null,
    },
    bankNumber: {
      type: String,
      required: false,
      default: null,
    },
    leads: [
      {
        email: {
          type: String,
          required: true,
        },
        fullName: {
          type: String,
          required: true,
        },
        funnel: {
          type: String,
          required: true,
        },
        platform: {
          type: String,
          required: true,
        },
        createdAt: {
          type: String,
          required: true,
        },
      },
    ],
    fotoProfile: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Methods
 * @param {*} password
 */

// Generating Password Hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Check if password valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
