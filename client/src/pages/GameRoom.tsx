import { useState } from "react";
import BoardComponent from "../chess/Board";
import { useChess } from "../contexts/chess.context";
import { useAuth } from "../contexts/auth.context";
import { initBoard } from "../chess/init.board";

export default function GameRoom() {
  const { joinGame, gameId , createGame } = useChess()
  const { user } = useAuth()

  const [gameIdInput , setGameIdInput] = useState('')
  
  const handleCreate = () => {
    if(!user?.username) return
    createGame(user.username , initBoard())
  }
  
  return(
    gameId?
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-6">
        <BoardComponent />
      </div>
    :
      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
        <div className="w-full max-w-xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-100 shadow-2xl shadow-black/50 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Enter the Arena</p>
          <h1 className="text-3xl font-semibold">Ready to challenge a mind?</h1>
          <p className="text-sm text-slate-400">
            Create a fresh match or join an existing duel by entering the room code shared by another player.
          </p>
          <div className="grid gap-4">
            <button
              onClick={handleCreate}
              className="rounded-2xl border border-emerald-400 bg-emerald-400/90 px-6 py-3 text-lg font-semibold text-emerald-950 shadow-lg shadow-emerald-400/30 transition hover:bg-emerald-300"
            >
              Host a New Game
            </button>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Room Code</label>
              <input
                type="text"
                placeholder="Enter Game ID"
                value={gameIdInput}
                onChange={(e) => setGameIdInput(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-lg font-semibold tracking-wider text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
              />
              <button
                onClick={() => joinGame(gameIdInput)}
                className="mt-4 w-full rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-200 transition hover:border-emerald-400 hover:text-white"
              >
                Join Game
              </button>
            </div>
          </div>
        </div>
      </section>
    )
}