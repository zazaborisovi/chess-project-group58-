import { useState } from "react";
import BoardComponent from "../chess/Board";
import { useChess } from "../contexts/chess.context";
import { useAuth } from "../contexts/auth.context";
import { initBoard } from "../chess/init.board";
import { useForm } from "../hooks/useForm";

export default function GameRoom() {
  const { joinGame, gameId , createGame , sendMessage} = useChess()
  const { user } = useAuth()

  const [gameIdInput , setGameIdInput] = useState('')
  const [formData , handleChange] = useForm({message:""})
  


  return(
    gameId?
      <div>
        <BoardComponent />
      </div>
    :
      <div>
        <button onClick={() => createGame(user.username , initBoard())}>create game with http</button>
        <input type="text" placeholder="Enter Game ID" value={gameIdInput} onChange={(e) => setGameIdInput(e.target.value)} />
        <button onClick={() => joinGame(gameIdInput)}>Join Game</button>
      </div>
    )
}