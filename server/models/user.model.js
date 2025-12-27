const mongoose = require('mongoose');
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
  }
}, {timestamps: true}) 