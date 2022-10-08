const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose.Promise = global.Promise;
  console.log(process.env.dbURL);
  // Connecting to the database
  mongoose
    .connect(process.env.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      // winston.info("Connected to MongoDB...");
      console.log("Successfully connected to the database");
    });
};
