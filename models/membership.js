const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const membershipSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", membershipSchema);
