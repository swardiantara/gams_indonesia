const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderMembershipSchema = new Schema(
  {
    paket: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referralCode: {
      type: String,
      required: false,
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: "Belum Bayar",
    },
    receipt: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order Membership", orderMembershipSchema);
