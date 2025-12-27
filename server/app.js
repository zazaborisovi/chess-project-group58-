require('dotenv').config(); // Load environment variables from .env file

// middleware imports
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// model imports
const GameRoom = require('./models/chess.game.room.model');

// initializing express app and http server
const app = express()
const server = http.createServer(app)

// middlewares
app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

// initializing socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
})

// initializing routes


// using socket
io.on("connection", (socket) =>{
  // authentication via socket
  socket.on("authenticate", ({userId}) =>{
    socket.userId = userId
  })
  
  // creates and joins game room
  socket.on("create-game-room" , async ({board}) =>{
    const room = await GameRoom.create({
      gameId: Math.random().toString(36).substring(2 , 15),
      player1: socket.userId,
      player2: null,
      board,
      turn: "white"
    })
    socket.join(room.gameId)
    // shows a game on client side
    socket.emit("room-created", {
      gameId: room.gameId,
      board: room.board,
      playerColor: room.turn
    })
  })
  
  // joining game via gameId
  socket.on("join-game-room", async ({gameId}) =>{
    const room = await GameRoom.findOne({gameId: gameId})
    
    console.log(room) // debugging purposes
    
    if(!room) return res.status(404).json({message: "Game not found"}) // checks if game room exists
    
    if(room.player2) return res.status(400).json({message: "Game is full"}) // checks if game room is full
    
    if(socket.userId === room.player1) return res.status(400).json({message: "You cannot join your own game"}) // checks if user is trying to join their own game
    
    room.player2 = socket.userId
    await room.save()
    
    socket.join(gameId)
    
    io.to(gameId).emit("start-game", {
      board: room.board,
      playerColor: "black",
      turn: room.turn
    })
  })
  
  // handling piece movement in real time via socket
  socket.on("piece-move", async(data) =>{
    setCache(data.gameId , {board: data.board , turn: data.turn}) // sets old board to new in cache and updates turn
    
    io.to(data.gameId).emit("piece-moved", { // updates board and turn on client side for everyone in room
      board: data.board,
      turn: data.turn
    })
  })
})

mongoose.connect(process.env.MONGODB_URI) // connects to database(MongoDB)
  .then(() =>{
    console.log("Connected to MongoDB")
    
    server.listen(process.env.PORT, () =>{ // connects to http server
      console.log(`server running on port ${process.env.PORT}`)
    })
  })