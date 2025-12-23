const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/VerifyToken");
const User = require("../models/User");

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email streakCount lastCompletedDate"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      streak: user.streakCount,
      lastCompletedDate: user.lastCompletedDate,
    });
  } catch (error) {
    console.error("User /me error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
