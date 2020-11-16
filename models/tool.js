const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toolSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    gallery: [
      {
        type: String,
        required: false
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tool", toolSchema);
