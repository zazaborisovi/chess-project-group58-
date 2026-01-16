const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME]; // takes cookie from request
    
    if (!cookie) return res.status(401).json({ message: "Unauthorized / no token"});

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Unauthorized / no user" });

    req.user = user;
    
    next()
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const socketProtect = async (socket, next) => {
  try {
    const cookie = socket.handshake.headers.cookie
    const token = cookie?.split('; ').find((row) => row.startsWith(`${process.env.COOKIE_NAME}=`))?.split('=')[1]
    
    if (!token) return next(new Error("Unauthorized"))
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.id)
    
    if (!user) return next(new Error("No user found with this token"))
    
    socket.request.user = user
    next()
  } catch (err) {
    next(new Error(err.message))
  }
}

const allowedTo = (...roles) =>{
  return (req, res, next) => {
    if (!roles.includes(req.user.role)){
      return next(res.status(403).json({ message: "Forbidden" }));
    }
    next();
  }
}

module.exports = {protect , allowedTo , socketProtect};