const Task = require("../models/Task");
const User = require("../models/User");

exports.getDashboardAnalytics = async (req, res) => {
  try {
   const userId = req.user?.id; 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const tasks = await Task.find({ userId });
    const user = await User.findById(userId);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasksCompletedToday = tasks.filter(t => {
      if (t.status !== "completed") return false;
      if (!t.updatedAt) return false;
      const taskDate = new Date(t.updatedAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }).length;

    // Calculate tasks scheduled for today (based on dueDate)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const todayTaskList = tasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).map(t => ({
      _id: t._id,
      title: t.title,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));
    const todayTasks = todayTaskList.length;

   
    const streakCount = user?.streakCount || 0;

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
      streakCount,
      tasksCompletedToday,
      todayTasks,
      todayTaskList,
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
