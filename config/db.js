const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connection Successful!");
  } catch (err) {
    console.error(`Error connecting to the database: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
