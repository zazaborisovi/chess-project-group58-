require('dotenv').config(); // Load environment variables from .env file

// middleware imports
const mongoose = require('mongoose')
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {setCache , getCache , cache} = require('./utils/cache');

// router imports
const userRouter = require('./routes/user.routes');
const oauthRouter = require('./routes/oauth.routes');
const roomRouter = require('./routes/game.room.routes');

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

// using socket
io.on("connection", (socket) =>{
  socket.on("create-game-room" , async ({gameId}) =>{
    const room = await GameRoom.findOne(gameId)
    socket.join(room.gameId)

    socket.emit("room-created")
  })
  
  // joining game via gameId
  socket.on("join-game-room", async ({ gameId, user }) => {
    let room = getCache(gameId)
    
    if (!room) {
      const dbData = await GameRoom.findOne({ gameId: gameId })
      if(dbData){
        room = {
          board: dbData.board,
          turn: dbData.turn
        }
        setCache(gameId , room)
      }
    }
    
    console.log(gameId, user)
    
    console.log(room) // debugging purposes
    
    if (!room) return console.log("game not found")
    
    const {player1 , player2} = await GameRoom.findOne({gameId: gameId}) // gets player1 and player2 from database
    const isPlayer1 = user === player1
    
    if (!player2 && !isPlayer1){
      await GameRoom.findOneAndUpdate({gameId: gameId}, {player2: user})
    }
    
    socket.emit("player-joined", {
      playerColor: isPlayer1 ? "white" : "black",
      opponent: isPlayer1 ? player2 : player1
    }) // emits player joined event which gives frontend color and opponent player of this player
    
    socket.join(gameId)
    
    io.to(gameId).emit("data", {
      board: room.board,
      turn: room.turn,
    })
  })
  
  // handling piece movement in real time via socket
  socket.on("piece-move", async(data) =>{
    setCache(data.gameId , {board: data.board , turn: data.turn}) // sets old board to new in cache and updates turn
    
    io.to(data.gameId).emit("piece-moved", { // updates board and turn on client side for everyone in room
      board: data.board,
      turn: data.turn,
      checkmate: data.checkmate,
      stalemate: data.stalemate
    })
    console.log(data.board , data.turn)
  })
})

// initializing routes
app.use("/api/auth", userRouter)
app.use("/api/oauth", oauthRouter)

app.use("/game" , roomRouter)

// connecting to database and starting server
mongoose.connect(process.env.MONGODB_URI)
  .then(() =>{
    console.log("Connected to MongoDB")
    
    server.listen(process.env.PORT, () =>{ // connects to http server
      console.log(`server running on port ${process.env.PORT}`)
    })
  })