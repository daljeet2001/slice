const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
});

module.exports = mongoose.model("Friend", friendSchema);
