const { signup , signin } = require('../controllers/user.controllers');
const protect = require('../middleware/protect');

const userRouter = require('express').Router();

userRouter.post("/signup" , signup)
userRouter.post("/signin" , signin)

userRouter.post("/auto-signin", protect, (req , res) =>{
  console.log(req.user)
  res.status(200).json(req.user)
})

module.exports = userRouter