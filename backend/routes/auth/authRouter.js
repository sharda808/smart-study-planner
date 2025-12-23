const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const AppUser = require("../../models/User"); // rename if you use AppUser
const Task = require("../../models/Task");
const verifyToken = require("../../middleware/VerifyToken");
const bcrypt = require("bcryptjs");
const {body, validationResult} = require("express-validator");
const SECRET_KEY = "studyplanner_secret";

// AUTH ROUTES 

// Signup
router.post("/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
    .isLength({min:6})
    .withMessage("Password must be at least 6 character"),
    body("confirmPassword")
    .custom((value,{req}) => value === req.body.password)
    .withMessage("Password do not match"),
  ],
  
    async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        errors:errors.array(),
      });
    }
   
    const {name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email & password required" });

    const existingUser = await AppUser.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await AppUser.create({ 
      name,
      email, 
      password: hashedPassword });
    res.json({ success: true, message: "Account created successfully", user: { email: newUser.email, id: newUser._id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login
router.post("/login", 
   [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  
    async (req, res) => {

  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({
        success:false,
        errors:errors.array(),
      })
    }
    const { email, password } = req.body;
    const user = await AppUser.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        success:false,
        message:"Invalid email or password,"
      });
    }

    

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1d" });
    res.json({
      success: true,
      token,
      user: { email: user.email, id: user._id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// TASK ROUTES

// Get tasks
router.get("/tasks", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add task
router.post("/tasks", verifyToken, async (req, res) => {
  try {
    const { title, priority } = req.body;
    if (!title || !priority)
      return res.status(400).json({ success: false, message: "Title & priority required" });

    const task = new Task({ title, priority, userId: req.user.id });
    await task.save();
    res.json({ success: true, message: "Task added successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Complete task
router.patch("/tasks/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "completed" },
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, message: "Task marked as completed", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ANALYTICS ROUT
router.get("/analytics", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = total - completed;

    const priority = {
      high: tasks.filter(t => t.priority === "high").length,
      medium: tasks.filter(t => t.priority === "medium").length,
      low: tasks.filter(t => t.priority === "low").length,
    };

    res.json({ success: true, total, completed, pending, priority });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
