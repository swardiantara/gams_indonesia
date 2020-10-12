const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    const db = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connected from ${db.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
