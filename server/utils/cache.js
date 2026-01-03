// cache is needed to store data of chess games so we can update database later instead of making socket functions wait for database to update and then send data to client (using timeout for it to automatically updoadte after certain time)

const GameRoom = require("../models/chess.game.room.model")

const cache = new Map() // Map for easier access and manipulation of cached data
const timers = new Map()

const getCache = (id) => {
  return cache.get(id)
}

const setCache = (id , { board , turn}) => {
  cache.set(id , {  board , turn})
  
  saveToDatabase(id)
  
  return console.log(`Cache set for game ${id}`)
}

// when we make a move we add new timer to update the data but if there was already timer for this game we clear it and just update cache so we can update multiple moves in same time in database
function saveToDatabase(id) {
  if(timers.has(id)){ // checks if timer for the game exists and deletes if it exists  
    clearTimeout(timers.get(id))
  }
  const newTimer = setTimeout(() => { // sets new timer for the game
    const data = getCache(id)
    if(data){
      GameRoom.updateOne({gameId: id} , {board: data.board , turn: data.turn})
    }
    timers.delete(id)
  }, 2000)
  timers.set(id , newTimer) // deletes timer for game after it updates database and expires(5 seconds in this case)
  console.log(`Timer set for game ${id}`)
}

module.exports = { setCache , getCache , cache}