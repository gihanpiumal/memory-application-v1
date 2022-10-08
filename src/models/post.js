const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  creator_id: { type: mongoose.Schema.ObjectId, required: true },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Posts", postSchema);
