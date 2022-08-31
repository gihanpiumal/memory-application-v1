const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  Avatar:{type: String},
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
