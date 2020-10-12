const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderdetailSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    item: {
      type: Array,
      required: true,
    },

    shippingCost: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: false,
    },
    referralCode: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      default: "Belum Bayar",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderDetail", orderdetailSchema);
