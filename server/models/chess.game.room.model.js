const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
  gameId: String,
  user1: String,
  user2: String,
  board: Array,
  turn: String,
  createdAt:{
    type: Date,
    default: Date.now
  }
})

const GameRoom = mongoose.model('GameRoom', gameRoomSchema)

module.exports = GameRoom