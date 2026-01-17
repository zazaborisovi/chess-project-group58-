require('dotenv').config(); // Load environment variables from .env file

// middleware imports
const mongoose = require('mongoose')
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { setGameCache, getGameCache , setChatCache , getChatCache } = require('./utils/cache');

// route imports
const authRouter = require('./routes/auth.route');
const oauthRouter = require('./routes/oauth.route');
const roomRouter = require('./routes/game.room.route');
const friendRouter = require('./routes/friends.route');
const adminRouter = require('./routes/admin.panel.route');
const chatRouter = require('./routes/chat.route');

// model imports
const GameRoom = require('./models/game.room.model');
const Chat = require('./models/chat.model');
const leaderboardRouter = require('./routes/leaderboard.route');
const { socketProtect } = require('./middleware/protect');
const User = require('./models/user.model');

// initializing express app and http server
const app = express()
app.set("trust proxy", 1)
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

io.use(socketProtect)

// using socket
io.on("connection", (socket) => {
  
  const user = socket.request.user
  
  socket.on("create-game-room" , async ({gameId}) =>{
    const room = await GameRoom.findOne(gameId)
    socket.join(room.gameId)

    socket.emit("room-created")
  })
  
  // joining game via gameId
  socket.on("join-game-room", async (gameId) => {
    let room = getGameCache(gameId)
    
    console.log(gameId)
    
    if (!room) {
      const dbData = await GameRoom.findOne({ gameId: gameId })
      if(dbData){
        room = {
          board: dbData.board,
          turn: dbData.turn,
          chat: dbData.chat
        }
        setGameCache(gameId , room , room.chat)
      }
    }
    
    if (!room) return console.log("game not found")
    
    const {player1 , player2} = await GameRoom.findOne({gameId: gameId}) // gets player1 and player2 from database
    const isPlayer1 = user.username === player1
    
    if (!player2 && !isPlayer1){
      await GameRoom.findOneAndUpdate({gameId: gameId}, {player2: socket.request.user.username})
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
    setGameCache(data.gameId , {board: data.board , turn: data.turn}) // sets old board to new in cache and updates turn
    
    io.to(data.gameId).emit("piece-moved", { // updates board and turn on client side for everyone in room
      board: data.board,
      turn: data.turn,
      checkmate: data.checkmate,
      stalemate: data.stalemate
    })
    
    if (data.checkmate) {
      const user = await User.findById(socket.request.user._id)
      user.wins += 1
      await user.save()
    }
  })
  
  socket.on("join-chat", async (chatId) => {    
    socket.join(chatId)
  })
  
  socket.on("send-message", async (data) => {
    const chat = await Chat.findById(data.chatId)
    const senderId = user._id
    setChatCache(chat._id, {
      sender: senderId,
      message: data.message
    })

    io.to(data.chatId).emit("message-sent", {
      sender: senderId,
      message: data.message
    })
  })
  
  socket.on("send-message-game", async (data) => {
    const gameRoom = getGameCache(data.gameId)
    setGameCache(data.gameId, {
      ...gameRoom,
      messages: [...gameRoom.messages, {
        sender: data.senderId,
        message: data.message
      }]
    })
  })
})

// initializing routes
app.use("/api/auth", authRouter)
app.use("/api/oauth", oauthRouter)
app.use("/api/game" , roomRouter)
app.use("/api/friends", friendRouter)
app.use("/api/admin", adminRouter)
app.use("/api/chats", chatRouter)
app.use("/api/leaderboard", leaderboardRouter)
app.get('/api/ping', (req, res) => {
  res.send(`
    <html>
      <body style="background:#0b0f1a; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh;">
        <div style="text-align:center;">
          <h1 style="font-size:14px; letter-spacing:2px;">ARENA SYNCED</h1>
          <p style="font-size:10px; color:#64748b;">This window will close automatically.</p>
        </div>
      </body>
    </html>
  `);
});

// connecting to database and starting server
mongoose.connect(process.env.MONGODB_URI)
  .then(() =>{
    console.log("Connected to MongoDB")
    
    httpServer.listen(process.env.PORT, () =>{ // connects to http server
      console.log(`server running on port ${process.env.PORT}`)
    })
  })