const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
  type:String,
  required:true,
  unique:true,
},
password: {
type:String,
required:true,
},
streakCount:{
  type:Number,
  default:0,
},
lastCompletedDate:{
  type:Date,
  default:null,
},
});
module.exports = mongoose.model("AppUser", UserSchema);