const GameRoom = require('../models/game.room.model');
const {setGameCache, getGameCache} = require('../utils/cache')

const roomInit = (player1, player2, board, private) => {
  const gameRoom = new GameRoom({
    gameId: Math.random().toString(36).substring(2, 10),
    player1,
    player2,
    turn: "white",
    board,
    private,
    gameStatus: "waiting"
  })
  gameRoom.save()
  return gameRoom
}

const createPrivateRoom = async (req , res) =>{
  try{
    const {board} = req.body
    const user = req.user
    
    const gameRoom = roomInit(user._id, null, board, false)
    
    res.status(201).json({gameId: gameRoom.gameId , board: gameRoom.board, turn: gameRoom.turn , url: `${process.env.CLIENT_URL}/game/${gameRoom.gameId}`})
    setGameCache(gameRoom.gameId , gameRoom)
  }catch(err){
    res.status(500).json({message: err.message});
  }
}

const createPublicRoom = async (req, res) => {
  const {board} = req.body
  const user = req.user
  
  const existingGame = await GameRoom.findOne({
    $or: [
      {player1: user._id},
      {player2: user._id}
    ],
    gameStatus: "started"
  })
  
  if (existingGame) {
    res.status(201).json({gameId: existingGame.gameId, board: existingGame.board, turn: existingGame.turn})
  }
  
  let gameRoom = await GameRoom.findOne({ player2: null, private: false, player1: { $ne: user._id, $exists: true } , gameStatus: "waiting"})
  
  if (gameRoom) {
    gameRoom.player2 = user._id
    gameRoom.gameStatus = "started"
    gameRoom.save()
    res.status(200).json({ gameId: gameRoom.gameId, board: gameRoom.board, turn: gameRoom.turn, url: `${process.env.CLIENT_URL}/game/${gameRoom.gameId}` })
    setGameCache(gameRoom.gameId, gameRoom)
    return
  }
  
  gameRoom = roomInit(user._id, null, board, false)
  
  res.status(200).json({ gameId: gameRoom.gameId, board: gameRoom.board, turn: gameRoom.turn, url: `${process.env.CLIENT_URL}/game/${gameRoom.gameId}` })
  setGameCache(gameRoom.gameId, gameRoom)
}

const getGameRoom = async (req , res) =>{
  try{
    const {gameId} = req.params
    
    let room = await getGameCache(gameId)
    
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

module.exports = {createPrivateRoom, getGameRoom , createPublicRoom}