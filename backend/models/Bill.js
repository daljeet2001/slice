const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  totalAmount: Number,
  participants: [
    {
      friendId: { type: mongoose.Schema.Types.ObjectId, ref: "Friend" },
      amountOwed: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bill", billSchema);
