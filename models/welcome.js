const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const welcome = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  titlePage: {
    type: String,
    required: true,
  },
  descriptionPage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Welcome", welcome);
