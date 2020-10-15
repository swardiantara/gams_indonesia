const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
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
    qty: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    gallery: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
