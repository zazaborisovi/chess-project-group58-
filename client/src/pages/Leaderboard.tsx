import { useLeaderBoard } from "@/contexts/leaderboard.context";

const LeaderboardPage = () => {
  const { leaderboard } = useLeaderBoard();

  // Separate top 3 for special styling
  const topThree = leaderboard.slice(0, 3);
  const theRest = leaderboard.slice(3);

  return (
    <section className="min-h-screen bg-[#0b0f1a] px-4 py-16 text-slate-200">
      <div className="mx-auto w-full max-w-3xl">
        
        {/* Header Section */}
        <header className="mb-14 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Hall of Fame</h1>
          <p className="text-base text-slate-400 mt-2">The highest-ranking players in the RECHESS arena.</p>
        </header>

        {/* Podium Section (Top 3) */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {topThree.map((player, index) => (
            <div 
              key={player._id || index}
              className={`relative flex flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-2xl transition-transform hover:scale-105 ${
                index === 0 
                  ? "border-indigo-500 bg-indigo-500/10 order-1 sm:order-2 sm:scale-110 z-10" 
                  : index === 1 
                  ? "border-slate-700 bg-slate-800/20 order-2 sm:order-1" 
                  : "border-slate-800 bg-slate-800/10 order-3"
              }`}
            >
              <div className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 text-2xl font-black ${
                index === 0 ? "border-indigo-400 text-indigo-400" : "border-slate-600 text-slate-500"
              }`}>
                {index + 1}
              </div>
              <h3 className="text-lg font-bold text-white truncate w-full">{player.username}</h3>
              <p className="text-sm font-black uppercase tracking-widest text-indigo-400 mt-1">
                {player.wins} Wins
              </p>
              {index === 0 && (
                <span className="absolute -top-3 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-white shadow-lg">
                  Champion
                </span>
              )}
            </div>
          ))}
        </div>

        {/* The List (Rank 4+) */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 whitespace-nowrap">
              Ranked Rankings
            </h2>
            <span className="h-[1px] flex-1 bg-slate-800"></span>
          </div>

          <div className="flex flex-col gap-3">
            {theRest.length > 0 ? (
              theRest.map((player, index) => (
                <div
                  key={player._id || index}
                  className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/30 p-5 transition-all hover:border-slate-700 hover:bg-slate-900/60"
                >
                  <div className="flex items-center gap-6">
                    <span className="w-6 text-center font-mono text-lg font-bold text-slate-600">
                      {index + 4}
                    </span>
                    <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400">
                      {player.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-base font-bold text-white">{player.username}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-indigo-400">{player.wins}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Wins</span>
                  </div>
                </div>
              ))
            ) : !topThree.length ? (
              <div className="py-20 text-center rounded-2xl border-2 border-dashed border-slate-800/50">
                <p className="text-slate-500 font-medium">Tournament data loading...</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPage;