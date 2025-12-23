
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User"); // ✅ FIX
const verifyToken = require("../middleware/VerifyToken");
const mongoose = require("mongoose");

/* GET TASKS */
router.get("/", verifyToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json({ success: true, tasks });
});

/* ADD TASK */
router.post("/", verifyToken, async (req, res) => {
  const { title, priority } = req.body;
  const task = new Task({ title, priority, userId: req.user.id });
  await task.save();
  res.json({ success: true, task });
});

/* DELETE TASK */
router.delete("/:id", verifyToken, async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  res.json({ success: true, message: "Task deleted" });
});

/* COMPLETE TASK + STREAK */
router.put("/:id/complete", verifyToken, async (req, res) => {
  try {
    const taskId = req.params.id; // ✅ FIX

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid Task ID" });
    }

    const task = await Task.findOne({
      _id: taskId,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.status === "completed") {
      return res.json({ success: true, message: "Already completed" });
    }

    task.status = "completed";
    await task.save();

    // 🔥 STREAK LOGIC
    const user = await User.findById(req.user.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = user.lastCompletedDate
      ? new Date(user.lastCompletedDate)
      : null;

    if (!lastDate) {
      user.streakCount = 1;
    } else {
      lastDate.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (lastDate.getTime() === yesterday.getTime()) {
        user.streakCount += 1;
      } else if (lastDate.getTime() !== today.getTime()) {
        user.streakCount = 1;
      }
    }

    user.lastCompletedDate = today;
    await user.save();

    res.json({
      success: true,
      message: "Task completed & streak updated",
      task,
      streak: user.streakCount,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
