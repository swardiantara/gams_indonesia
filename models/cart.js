const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    qty: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
