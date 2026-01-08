const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ 
    senderId: mongoose.Schema.Types.ObjectId,
    message: String
  }]
})

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;