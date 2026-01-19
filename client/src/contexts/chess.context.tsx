import { createContext, useState , useEffect, useContext } from "react";
import type { Board } from "../types/chess.types";
import { useSocket } from "./utils/socket.context";
import { initBoard } from "@/chess/init.board";

const API_URL = import.meta.env.VITE_API_URL

const ChessContext = createContext();

export const useChess = () => useContext(ChessContext)

const ChessProvider = ({children}) =>{
  const [board , setBoard] = useState<Board>()
  const [turn , setTurn] = useState("white")
  // checking for game state
  const [stalemate , setStalemate] = useState(false)
  const [checkmate , setCheckmate] = useState(false)
  
  // to create new game room
  const [gameId , setGameId] = useState("")
  const [playerColor , setPlayerColor] = useState("")
  
  const socket = useSocket()
  
  const createPrivateGame = async() => {
    try {
      const board = initBoard()
      const res = await fetch(`${API_URL}/game/private`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({board}),
        credentials: "include"
      })
      
      const data = await res.json()
      
      if(!res.ok) return console.log(data.message)
      
      return data
    }catch(err){
      console.log(err)
    }
  }
  
  const joinRandomGame = async () => { // creates new game room if no game is available
    try {
      const board = initBoard()
      const res = await fetch(`${API_URL}/game/public`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({board}),
        credentials: "include"
      })
      
      const data = await res.json()
      
      if(!res.ok) return console.log(data.message)
      
      joinGame(data.gameId)
    }catch(err){
      console.log(err)
    }
  }
  
  const joinGame = (id) =>{
    try{
      window.location.href = `${import.meta.env.VITE_CLIENT_URL}/game/${id}`
    }catch(err){
      console.log(err)
    }
  }
  
  useEffect(() => {
    socket.on("piece-moved" , ({board, turn, stalemate, checkmate}) =>{
      setBoard(board)
      setTurn(turn)
      setStalemate(stalemate)
      setCheckmate(checkmate)
    })
    
    socket.on("game-message", (message) => {
      console.log(message)
    })
    
    return () => {
      socket.off("piece-moved")
      socket.off("game-message")
    }
  }, [])
  
  const updateBoardForEveryone = (newBoard: Board, nextTurn: string, { checkmate , stalemate}) =>{ // updates the board for everyone in the same game room
    if(!socket || !gameId) return console.log("Socket or gameId is undefined")
    
    socket.emit("piece-move", { gameId, board: newBoard, turn: nextTurn , checkmate , stalemate})
    setBoard(newBoard)
    setTurn(nextTurn)
    console.log(board , turn)
  }
  
  const sendGameMessage = (data) => {
    if(!socket || !gameId) return console.log("Socket or gameId is undefined")
    
    socket.emit("send-game-message", { gameId, message: data.message })
  }
  
  return(
    <ChessContext.Provider value={{
      socket,
      board,
      setBoard,
      updateBoardForEveryone,
      turn,
      setTurn,
      gameId,
      playerColor,
      setPlayerColor,
      joinGame,
      stalemate,
      setStalemate,
      checkmate,
      setCheckmate,
      createPrivateGame,
      setGameId,
      joinRandomGame,
      sendGameMessage
    }}>
      {children}
    </ChessContext.Provider>
  ) 
}

export default ChessProvider
