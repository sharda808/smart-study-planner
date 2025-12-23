const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../../models/Task");
const verifyToken = require("../../middleware/VerifyToken");

router.get("/", verifyToken, async(req,res)=> {
  try {
    // Convert userId to ObjectId if it's a string
    const userId = mongoose.Types.ObjectId.isValid(req.user.id) 
      ? new mongoose.Types.ObjectId(req.user.id) 
      : req.user.id;
    
    const tasks = await Task.find({userId: userId});
    const completed = tasks.filter(t=> t.status==="completed").length;
    const pending = tasks.filter(t=> t.status!=="completed").length;
    
    res.json({
      success: true,
      message: "Analytics fetched successfully",
      total: tasks.length,
      completed: completed,
      pending: pending,
      priority: {
        high: tasks.filter(t=> t.priority === 'high').length,
        medium: tasks.filter(t=>t.priority === "medium").length,
        low: tasks.filter(t=>t.priority ==="low").length,
      }
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message
    });
  }
});
module.exports = router;
