const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI ="mongodb+srv://sushanth:CuBG7VbIpsszh9eu@cluster0.xmbzp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; //production
// const MONGODB_URI ="mongodb+srv://vasudev082002:digi9%40123@cluster0.zm1sn.mongodb.net/testDatabase?retryWrites=true&w=majority"  //development
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Uncomment if using older versions of Mongoose
      // useFindAndModify: false, // Uncomment if using older versions of Mongoose
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
