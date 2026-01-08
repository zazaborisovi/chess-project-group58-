const User = require('../models/user.model');

const createAndSendToken = async (user , statusCode , res) =>{
  try{
    const token = user.signToken()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV == "prod",
      sameSite: process.env.NODE_ENV == "prod" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    res.status(statusCode).cookie(process.env.COOKIE_NAME, token, cookieOptions).json({message: "token sent"})
  }catch(err){
    return res.status(500).json({message: err.message})
  }
}

const signup = async (req , res) =>{
  try{
    const { email, username, password } = req.body
    
    console.log("executed", email, username, password)
    
    const checkEmail = await User.findOne({email: email})

    if(checkEmail) return res.status(400).json({message: 'User with this email already exists'})
    
    const user = await User.create({email, username, password})
    await user.save()
    console.log("user created", user)
    
    createAndSendToken(user, 201, res)
  }catch(err){
    console.log(err)
    res.status(500).json(err.message)
  }
}

const signin = async (req , res) =>{
  try{
    const {email, password} = req.body
    const user = await User.findOne({email}).select("password")
    
    if(!user) return res.status(401).json({message: 'Email or password is incorrect'})
    
    if(!user.comparePassword(password)) return res.status(401).json({message: 'Email or password is incorrect'})
    
    createAndSendToken(user, 201, res)
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

module.exports = { signup , signin }