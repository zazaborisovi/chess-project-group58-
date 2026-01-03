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
    
    const checkEmail = await User.findOne({email})
    if(checkEmail) return res.status(400).json({message: 'User with this email already exists'})
    
    const user = await User.create({email, username, password})
    await user.save()
    
    createAndSendToken(user, 201, res)
  }catch(err){
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

const sendFriendRequest = async (req , res) =>{
  try{
    const {userId} = req.body
    const user = req.user
    
    const sendingTo = await User.findById(userId)
    
    if(!sendingTo) return res.status(404).json({message: "User with this id does not exist"})
    if(user.id === sendingTo._id) return res.status(400).json({message: "Cannot send friend request to yourself"})
    
    const friendRequest = {
      from: user.username,
      to: sendingTo.username
    }
    
    if(user.friendRequests.some(friendRequest)) return res.status(400).json({message: "Friend request already sent"})

    
    
    await user.friendRequests.push(friendRequest)
    await sendingTo.friendRequests.push(friendRequest)

    await Promise.all([user.save(), sendingTo.save()])
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

const fetchFriends = async (req , res) =>{
  try{
    const { friends } = req.user
    
    console.log(req.user , "helloooo")
    
    const friendPromises = friends.map(async (friendId) =>{
      const friend = await User.findById(friendId).select("username _id")
      return {id: friend._id , username: friend.username}
    })
    
    const friendArr = await Promise.all(friendPromises)
    
    console.log(friendArr)
    
    res.status(200).json({friends: friendArr})
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

module.exports = { signup , signin , sendFriendRequest , fetchFriends}