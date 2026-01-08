const { signup , signin } = require('../controllers/auth.controller');
const {protect} = require('../middleware/protect');

const authRouter = require('express').Router();

authRouter.post("/signup" , signup)
authRouter.post("/signin" , signin)

authRouter.post("/auto-signin", protect, (req , res) =>{
  console.log(req.user)
  res.status(200).json(req.user)
})

authRouter.post("/signout", protect , (req , res) =>{
  res.clearCookie(`${process.env.COOKIE_NAME}`).status(200).send()
})

module.exports = authRouter