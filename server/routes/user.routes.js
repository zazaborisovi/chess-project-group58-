const { signup , signin, sendFriendRequest, fetchFriends } = require('../controllers/user.controllers');
const protect = require('../middleware/protect');

const userRouter = require('express').Router();

userRouter.post("/signup" , signup)
userRouter.post("/signin" , signin)

userRouter.post("/send-friend-request", protect, sendFriendRequest)

userRouter.get("/friends", protect , fetchFriends)

userRouter.post("/auto-signin", protect, (req , res) =>{
  console.log(req.user)
  res.status(200).json(req.user)
})

userRouter.post("/signout", protect , (req , res) =>{
  res.clearCookie(`${process.env.COOKIE_NAME}`).status(200).send()
})

module.exports = userRouter