const User = require("../models/user.model");

const fetchUsers = async (req, res) => {
  try{
    const users = await User.find()
    res.status(200).json(users)
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

const updateUser = async (req , res) =>{
  try{
    const user = req.body
    console.log(user , user._id)
    const updatedUser = await User.findByIdAndUpdate(user._id , user , {new: true}) // new: true ensures that the updated user is returned to frontend instead of one we found(older one)
    
    console.log(updatedUser)
    res.status(200).json({user: updatedUser})
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

module.exports = {fetchUsers , updateUser}