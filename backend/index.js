const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/auth/authRouter");
const analyticsRoutes = require("./routes/analytics");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");
const MONGO_DB_URL = "mongodb+srv://shardakumari96115_db_user:Add%40123456@airbnb.s8zku2p.mongodb.net/airbnb?appName=Airbnb";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/analytics", analyticsRoutes);
app.get("/", (req,res) => {
  res.json({success:true, message:"Study Planner API running"});
});



mongoose.connect(MONGO_DB_URL)
 

  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(5000, () => {
      console.log(" Server runnig on port 5000")
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });