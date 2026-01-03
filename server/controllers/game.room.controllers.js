const GameRoom = require('../models/chess.game.room.model');
const {cache , setCache} = require('../utils/cache')

const createGameRoom = async (req , res) =>{
  try{
    const {username , board} = req.body
    
    console.log(username , board)
    
    const gameId = Math.random().toString(36).substring(2, 10)
    
    const gameRoom = await GameRoom.create({
      gameId,
      player1: username,
      player2: null,
      board: board,
      turn: "white"
    })
    
    res.status(201).json({gameId: gameRoom.gameId , board: gameRoom.board, turn: gameRoom.turn , url: `${process.env.CLIENT_URL}/game/${gameRoom.gameId}`})
    setCache(gameId , gameRoom)
  }catch(err){
    res.status(500).json({message: err.message});
  }
}

const getGameRoom = async (req , res) =>{
  try{
    const {gameId} = req.params
    
    let room = await cache.get(gameId)
    
    const {player1 , player2} = await GameRoom.findOne({gameId}).select("player1 player2")
    
    
    if(!room) return res.status(404).json({message: "game not found"});
    
    res.json({
      gameId,
      player1,
      player2,
      board: room.board,
      turn: room.turn
    })
  }catch(err){
    res.status(500).json({message: err.message});
  }
}

module.exports = {createGameRoom, getGameRoom}