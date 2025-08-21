const express = require("express");
const Bill = require("../models/Bill");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add bill
router.post("/add", protect, async (req, res) => {
  const { totalAmount, participants } = req.body;

  const splitAmount = totalAmount / participants.length;
  const bill = await Bill.create({
    userId: req.user,
    totalAmount,
    participants: participants.map(id => ({ friendId: id, amountOwed: splitAmount }))
  });

  res.json(bill);
});

// Get bills
router.get("/", protect, async (req, res) => {
  const bills = await Bill.find({ userId: req.user }).populate("participants.friendId");
  res.json(bills);
});

module.exports = router;
