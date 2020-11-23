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
      default: "Calon Member",
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
    license: {
      type: String,
      required: false,
      default: null,
    },
    referralCode: {
      type: String,
      required: false,
      default: null,
    },
    downline: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
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
        type: Schema.Types.Object,
        ref: "Leads",
        required: false,
      },
    ],
    fotoProfile: {
      type: String,
      required: false,
      default: null,
    },
    commission: [
      {
        //Tipe commision: referral, personal, team
        type: {
          type: String,
          required: false,
        },
        order: {
          type: Schema.Types.ObjectId,
          ref: "OrderDetail",
          required: false,
        },
        jumlah: {
          type: Number,
          required: false
        },
        //not_paid, paid
        status: {
          type: String,
          required: false,
        },
        createdAt: {
          type: String,
          required: false,
        },
      }
    ]
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
