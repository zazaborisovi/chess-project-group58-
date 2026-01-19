const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
  gameId: String,
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  board: mongoose.Schema.Types.Mixed,
  turn: String,
  createdAt:{
    type: Date,
    default: Date.now
  },
  private: Boolean,
  gameStatus: ["waiting", "started", "finished"]
})

const GameRoom = mongoose.model('GameRoom', gameRoomSchema)

module.exports = GameRoom