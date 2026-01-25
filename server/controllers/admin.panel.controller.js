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

const updateProfilePicture = async (req, res) => {
  try {
    const file = req.file
    const { userId } = req.body
    const user = await User.findById(userId)
    
    if (!file) return res.status(400).json({ message: "No file found to upload" })
    
    const publicId = `profile_pictures/${user._id}`
    
    const uploadPhoto = await uploadImage(file.buffer, publicId)
    
    if(!uploadPhoto) return res.status(500).json({message: "Failed to upload profile picture"})
    
    user.profilePicture = {
      url: uploadPhoto.secure_url,
      publicId
    }
    await user.save()
    
    res.status(200).json({message: "Profile picture updated successfully"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.body.userId)
    res.status(200).json({message: "User deleted successfully"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

module.exports = {fetchUsers , updateUser , updateProfilePicture , deleteUser}