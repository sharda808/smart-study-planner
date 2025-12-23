const Task = require("../models/Task");

exports.getDashboardAnalytics = async (req, res) => {
  try {
   const userId = req.user?.id; 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const tasks = await Task.find({ userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;

    const priority = {
      high: tasks.filter(t => t.priority === "high").length,
      medium: tasks.filter(t => t.priority === "medium").length,
      low: tasks.filter(t => t.priority === "low").length,
    };

        const suggestions = [];
    if (pendingTasks > 5) {
      suggestions.push("You have many pending tasks. Try breaking them into smaller goals.");
    }
    if (priority.high > 0) {
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
      console.log("Sending suggestions:",suggestions);
    }
    return res.json({
      success: true,
      totalTasks,
      completedTasks,
      pendingTasks,
      priority,
       suggestions,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load analytics",
    });
  }
};
