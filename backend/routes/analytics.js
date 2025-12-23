const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/VerifyToken");
const {
  getDashboardAnalytics,
} = require("../controllers/analyticsController");

router.get("/dashboard", verifyToken, getDashboardAnalytics);

module.exports = router;
