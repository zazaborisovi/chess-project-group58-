const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
  gameId: String,
  player1: String,
  player2: String,
  board: mongoose.Schema.Types.Mixed,
  turn: String,
  createdAt:{
    type: Date,
    default: Date.now
  }
})

const GameRoom = mongoose.model('GameRoom', gameRoomSchema)

module.exports = GameRoom