const User = require('../models/user.model');

const fetchLeaderboard = async (req , res) =>{
  try{
    const users = await User.find().sort({wins: -1})
    res.status(200).json(users)
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

module.exports = { fetchLeaderboard }