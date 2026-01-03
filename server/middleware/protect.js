const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME]; // takes cookie from request
    
    if (!token) return res.status(401).json({ message: "Unauthorized"});

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    
    next()
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = protect;