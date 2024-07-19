const mongoose = require("mongoose");
require("dotenv").config();
const mongoURL = process.env.MONGODB;

async function connectDB() {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connection Successful");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
  }
}

connectDB();

module.exports = mongoose;
