const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ 
    sender: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String,
      profilePicture: String
    },
    message: String
  }]
})

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;