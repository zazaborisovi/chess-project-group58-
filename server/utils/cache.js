// cache is needed to store data of chess games so we can update database later instead of making socket functions wait for database to update and then send data to client (using timeout for it to automatically updoadte after certain time)

const GameRoom = require("../models/game.room.model")
const Chat = require("../models/chat.model")

const gameCache = new Map() // Map for easier access and manipulation of cached data
const timers = new Map()

const getGameCache = (id) => {
  return gameCache.get(id)
}

const setGameCache = (id , { player1 , player2 , board , turn , chat }) => {
  gameCache.set(id , {player1 , player2 , board , turn , chat})
  
  saveGameToDatabase(id)
  
  return console.log(`Cache set for game ${id}`)
}

// when we make a move we add new timer to update the data but if there was already timer for this game we clear it and just update cache so we can update multiple moves in same time in database
function saveGameToDatabase(id) {
  if(timers.has(id)){ // checks if timer for the game exists and deletes if it exists  
    clearTimeout(timers.get(id))
  }
  const newTimer = setTimeout(async() => { // sets new timer for the game
    const data = getGameCache(id)
    if(data){
      await GameRoom.updateOne({gameId: id} , {board: data.board , turn: data.turn , chat: data.chat})
    }
    timers.delete(id)
  }, 2000)
  timers.set(id , newTimer) // deletes timer for game after it updates database and expires(5 seconds in this case)
  console.log(`Timer set for game ${id}`)
}

const chatCache = new Map()

const getChatCache = (chatId) => {
  return chatCache.get(chatId)
}

const setChatCache = async(chatId, message) => {
  let chat = getChatCache(chatId)
  
  console.log(message)

  if (!chat) {
    const dbChat = await Chat.findById(chatId)

    chat = { messages: dbChat?.messages || [] }
    chatCache.set(chatId, chat)
    console.log(`Chat cache initialized for ${chatId}`)
  }

  chatCache.set(chatId, {
    ...chat,
    messages: [...chat.messages, message],
  });
  
  saveChatToDatabase(chatId)
  
  return console.log(`Cache set for chat ${chatId} , ${chat.messages}`)
}

function saveChatToDatabase(chatId){
  if(timers.has(chatId)){ 
    clearTimeout(timers.get(chatId))
  }
  const newTimer = setTimeout(async() => {
    const data = getChatCache(chatId)
    if(data){
      await Chat.updateOne({ _id: chatId } , {messages: data.messages})
    }
    timers.delete(chatId)
  }, 2000)
  timers.set(chatId , newTimer)
  console.log(`Timer set for chat ${chatId}`)
}

module.exports = { setGameCache , getGameCache , gameCache , setChatCache , getChatCache , chatCache }