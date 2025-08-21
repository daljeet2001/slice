const express = require("express");
const Bill = require("../models/Bill");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add bill
router.post("/add", protect, async (req, res) => {
  try {
    const { totalAmount, participants } = req.body;

    const bill = await Bill.create({
      userId: req.user, 
      totalAmount,
      participants 
    });

    res.status(201).json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create bill" });
  }
});


// Get bills
router.get("/", protect, async (req, res) => {
  const bills = await Bill.find({ userId: req.user }).populate("participants.friendId");
  res.json(bills);
});

module.exports = router;
