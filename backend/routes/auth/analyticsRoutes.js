const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../../models/Task");
const verifyToken = require("../../middleware/VerifyToken");
const User = require("../../models/User"); 


router.get("/", verifyToken, async(req,res)=> {
  try {
   
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
  router.get("/dashboard", verifyToken, async(req,res) => {
    try {
      const user = await User.findById(req.user.id);
      const tasks = await Task.find({userId: req.user.id});
      
      const start = new Date();
      start.setHours(0,0,0,0);
      const end = new Date();
      end.setHours(23,59,59,999);
      
 
      const todayTaskList = await Task.find({
        userId: req.user.id,
        dueDate: {$gte: start, $lte: end}
      }).select('_id title priority status dueDate createdAt updatedAt');
      
      const todayTasks = todayTaskList.length;
      
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tasksCompletedToday = tasks.filter(t => {
        if (t.status !== "completed") return false;
        if (!t.updatedAt) return false;
        const taskDate = new Date(t.updatedAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }).length;
      
     
      const suggestions = [];
      const pendingTasks = tasks.filter(t=>t.status !== "completed").length;
      const completedTasks = tasks.filter(t=>t.status === "completed").length;
      
      if (pendingTasks > 5) {
        suggestions.push("You have many pending tasks. Try breaking them into smaller goals.");
      }
      const highPriority = tasks.filter(t=> t.priority === 'high').length;
      if (highPriority > 0) {
        suggestions.push("Focus on high priority tasks first to maximize productivity.");
      }
      if (completedTasks === 0) {
        suggestions.push("Start small. Complete just one task today to build your streak.");
      }
      if (completedTasks >= 5) {
        suggestions.push("Amazing consistency! Keep your study streak going.");
      }
      if (suggestions.length === 0) {
        suggestions.push("Keep going! Every task you complete counts.");
      }
      
      res.json({
        success: true,
        totalTasks: tasks.length,
        completedTasks: completedTasks,
        pendingTasks: pendingTasks,
        priority: {
          high: tasks.filter(t=> t.priority === 'high').length,
          medium: tasks.filter(t=>t.priority === "medium").length,
          low: tasks.filter(t=>t.priority ==="low").length,
        },
        todayTasks: todayTasks,
        todayTaskList: todayTaskList,
        tasksCompletedToday: tasksCompletedToday,
        streakCount: user?.streakCount || 0,
        suggestions: suggestions
      });
    } catch(err){
      res.status(500).json({success:false,message:err.message});
    }
  });

module.exports = router;
