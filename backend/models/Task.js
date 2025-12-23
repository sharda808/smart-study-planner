const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  priority:{
    type:String,
    enum:["high","medium", "low"],
    default:"medium",
  },
  status:{
    type:String,
    enum:["pending", "completed"],
    default:"pending",
  },
  userId: {
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true,
  },
  createdAt:{
    type:Date,
     default: null,
    },
 dueDate:{
  type:Date,
 },
 
},{timestamps:true});
module.exports = mongoose.model("Task", TaskSchema);