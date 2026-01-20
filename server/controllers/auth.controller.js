const User = require('../models/user.model');
const {uploadImage} = require('../utils/images');

const createAndSendToken = async (user , statusCode , res) =>{
  try{
    const token = user.signToken()
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV == "prod",
      sameSite: process.env.NODE_ENV == "prod" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    };
    res.status(statusCode).cookie(process.env.COOKIE_NAME, token, cookieOptions).json({message: "token sent"})
  }catch(err){
    return res.status(500).json({message: err.message})
  }
}

const signup = async (req , res) =>{
  try{
    const { email, username, password } = req.body
    
    const checkEmail = await User.findOne({email: email})

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

const changeProfilePicture = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const publicId = `profile_pictures/${user._id}`;

    const uploadPhoto = await uploadImage(file.buffer, publicId);

    if (!uploadPhoto || uploadPhoto.error)
      return res.status(400).json({ message: "Error uploading image" + uploadPhoto.error });

    user.profilePicture.url = uploadPhoto.secure_url;
    
    await user.save();

    res.status(200).json({ message: "Profile picture updated successfully", updatedUser: user });
  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

module.exports = { signup , signin , changeProfilePicture}