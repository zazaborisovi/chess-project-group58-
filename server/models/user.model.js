const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: [true , 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  username:{
    type: String,
    required: [true , 'Username is required'],
    unique: true,
    minlength: [4, 'Username must be at least 4 characters long'],
    maxlength: [20, 'Username must be at most 20 characters long']
  },
  password:{
    type: String,
    required: [function () {
      return !this.oauthProvider
    }, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    maxlength: [20, 'Password must be at most 20 characters long']
  },
  oauthId: String,
  oauthProvider:{
    type: String,
    enum: ['google', 'facebook', 'github', null]
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  wins: { // for leaderboard
    type: Number,
    default: 0
  },
  // was planning on adding elo rating but it will take more than 2 weeks
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: []
  },
  friendRequests: {
    type: [{
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      state: { type: String, enum: ["pending" , "accepted" , "rejected"], default: 'pending'},
      to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    default: []
  }
}, {timestamps: true})

UserSchema.pre("save" , function(){
  if (!this.isModified("password")) return
  this.password = bcrypt.hash(this.password, 15) // hashes the password before saving it
})

UserSchema.methods.comparePassword = async function(candidate){
  return await bcrypt.compare(candidate , this.password)
}

UserSchema.methods.signToken = function(){
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

const User = mongoose.model("User" , UserSchema)

module.exports = User