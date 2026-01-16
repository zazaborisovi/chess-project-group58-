import { useState } from "react";
import BoardComponent from "../chess/Board";
import { useChess } from "../contexts/chess.context";
import { useAuth } from "../contexts/auth.context";
import { initBoard } from "../chess/init.board";

export default function GameRoom() {
  const { joinGame, gameId, createPrivateGame, joinRandomGame } = useChess();
  const { user } = useAuth();
  const [gameIdInput, setGameIdInput] = useState('');

  const handleCreate = () => {
    if (!user?.username) return;
    createPrivateGame(initBoard());
  };

  const handleJoinRandomGame = () => {
    joinRandomGame(initBoard());
  };

  return (
    gameId ? (
      // Actual Game View
      <div className="min-h-screen bg-[#0b0f1a] pt-20 pb-10 flex flex-col items-center">
        <div className="w-full max-w-[100vw] overflow-hidden px-2 md:px-0">
          <BoardComponent />
        </div>
      </div>
    ) : (
      // Lobby / Entry View
      <section className="flex min-h-screen items-center justify-center bg-[#0b0f1a] px-6 py-20">
        <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          
          {/* Decorative Background Glow */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]" />
          
          <div className="relative z-10 text-center space-y-8">
            <header className="space-y-3">
              <span className="rounded-full bg-indigo-500/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                The Arena
              </span>
              <h1 className="text-4xl font-black tracking-tighter text-white md:text-5xl">Ready for a duel?</h1>
              <p className="mx-auto max-w-xs text-sm font-medium text-slate-500">
                Instantly match with a stranger or create a private sanctuary for your next match.
              </p>
            </header>

            <div className="flex flex-col gap-4">
              {/* Primary Action */}
              <button 
                onClick={handleJoinRandomGame}
                className="group relative flex h-16 items-center justify-center overflow-hidden rounded-2xl bg-white text-black transition-all hover:bg-slate-200 active:scale-[0.98]"
              >
                <span className="text-sm font-black uppercase tracking-widest">Quick Match</span>
              </button>

              {/* Secondary Action */}
              <button
                onClick={handleCreate}
                className="h-16 rounded-2xl border border-white/10 bg-slate-950/50 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-slate-950 hover:border-white/20 active:scale-[0.98]"
              >
                Host Private Game
              </button>

              {/* Room Code Entry */}
              <div className="mt-4 space-y-4 rounded-3xl bg-black/20 p-6 border border-white/5">
                <div className="text-left">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Invitation Code
                  </label>
                  <input
                    type="text"
                    placeholder="PASTE ID HERE"
                    value={gameIdInput}
                    onChange={(e) => setGameIdInput(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-slate-900/80 border border-white/5 px-4 py-4 text-center font-mono text-lg font-bold tracking-[0.2em] text-indigo-400 outline-none transition focus:border-indigo-500/50"
                  />
                </div>
                <button
                  onClick={() => joinGame(gameIdInput)}
                  className="w-full rounded-xl border-2 border-indigo-500/20 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 transition-all hover:bg-indigo-500/10 hover:border-indigo-500/50"
                >
                  Join via Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
}