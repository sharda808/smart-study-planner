const jwt = require("jsonwebtoken");
const SECRET_KEY = "studyplanner_secret";
const verifyToken =(req,res,next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).json({
      success:false,
     message:"Token missing",

    })
  }
    if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format",
    });
  }
  const token = authHeader.split(" ")[1];
try {
  const decoded = jwt.verify(token,SECRET_KEY);
  req.user = decoded;
  next();
} catch(err){
  return res.status(401).json({
    success:false,
    message:"Invalid or expired token",
  });
}
};
module.exports = verifyToken;