require('dotenv').config(); // Load environment variables from .env file

// middleware imports
const mongoose = require('mongoose')
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { setCache, getCache } = require('./utils/cache');
const protect = require('./middleware/protect');

// route imports
const authRouter = require('./routes/auth.route');
const oauthRouter = require('./routes/oauth.route');
const roomRouter = require('./routes/game.room.route');
const friendRouter = require('./routes/friends.route');
const adminRouter = require('./routes/admin.panel.route');
const chatRouter = require('./routes/chat.route');

// model imports
const GameRoom = require('./models/game.room.model');

// initializing express app and http server
const app = express()
const httpServer = http.createServer(app)

// middlewares
app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

// initializing socket.io on httpServer
const io = new Server(httpServer, {
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
          turn: dbData.turn,
          chat: dbData.chat
        }
        setCache(gameId , room , room.chat)
      }
    }
    
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
  
  socket.on("send-message", async({gameId , message , user}) =>{
    const messageObj = {
      sender: user,
      message: message
    }
    
    io.to(gameId).emit("message-sent", {messageObj})
  })
})

// initializing routes
app.use("/api/auth", authRouter)
app.use("/api/oauth", oauthRouter)
app.use("/api/game" , roomRouter)
app.use("/api/friends", friendRouter)
app.use("/api/admin", adminRouter)
app.use("/api/chats", chatRouter)

// connecting to database and starting server
mongoose.connect(process.env.MONGODB_URI)
  .then(() =>{
    console.log("Connected to MongoDB")
    
    httpServer.listen(process.env.PORT, () =>{ // connects to http server
      console.log(`server running on port ${process.env.PORT}`)
    })
  })