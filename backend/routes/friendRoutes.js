const express = require("express");
const Friend = require("../models/Friend");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add friend
router.post("/add", protect, async (req, res) => {
  const { name } = req.body;
  const friend = await Friend.create({ userId: req.user, name });
  res.json(friend);
});

// Get friends
router.get("/", protect, async (req, res) => {
  const friends = await Friend.find({ userId: req.user });
  res.json(friends);
});

module.exports = router;
