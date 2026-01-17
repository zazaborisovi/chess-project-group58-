import { useState } from "react";
import { useForm } from '../hooks/useForm';
import { useAuth } from '../contexts/auth.context';
import { Link } from "react-router"; // Using react-router as requested

const API_URL = import.meta.env.VITE_API_URL

const SignUp = () => {
  const { signup } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isWaking, setIsWaking] = useState(false);

  const [formData, handleChange] = useForm({
    username: '',
    email: '',
    password: '',
  });

  // THE SAFARI HACK LOGIC
  const wakeUpServer = () => {
    setIsWaking(true);
    
    // 1. Open popup (User-initiated interaction for Safari trust)
    const popup = window.open(
        `${API_URL}/ping`, 
        "ArenaSync", 
        "width=1,height=1,left=1000,top=1000"
    );

    // 2. Poll the server until it responds
    const checkServer = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/ping`);
        if (response.ok) {
          if (popup) popup.close();
          setIsConnected(true);
          clearInterval(checkServer);
        }
      } catch (err) {
        console.log("Waiting for Arena...");
      }
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[#0b0f1a] px-6 py-24">
      
      {/* ARENA SHIELD OVERLAY */}
      {!isConnected && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#0b0f1a]/90 backdrop-blur-xl">
          <div className="w-full max-w-sm space-y-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-10 text-center shadow-2xl">
            <div className="flex justify-center">
              <div className={`relative flex h-20 w-20 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/5 ${isWaking ? 'animate-pulse' : ''}`}>
                <div className={`h-12 w-12 rounded-full border-2 border-transparent border-t-indigo-500 ${isWaking ? 'animate-spin' : ''}`} />
                <span className="absolute text-xl">🛡️</span>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase">Initialize Arena</h2>
              <p className="text-sm font-medium text-slate-500">
                Establish a secure handshake with ReChess servers to enable cross-device play.
              </p>
            </div>
            <button
              type="button"
              onClick={wakeUpServer}
              disabled={isWaking}
              className="group relative w-full overflow-hidden rounded-2xl bg-indigo-600 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
            >
              {isWaking ? "Syncing with Server..." : "Connect to Arena"}
            </button>
          </div>
        </div>
      )}

      {/* ORIGINAL SIGNUP UI */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]" />
        
        <div className="relative z-10 space-y-8">
          <header className="space-y-3 text-center">
            <span className="rounded-full bg-indigo-500/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
              New Recruit
            </span>
            <h1 className="text-4xl font-black tracking-tighter text-white">Join Ranks</h1>
            <p className="text-sm font-medium text-slate-500">
              Unlock leaderboards, friends, and live chess duels.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Email Address
              </label>
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="name@example.com"
                onChange={handleChange} 
                className="w-full rounded-2xl border border-white/5 bg-black/20 px-5 py-4 text-sm font-bold text-white outline-none transition focus:border-indigo-500/50" 
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Username
              </label>
              <input 
                type="text" 
                name="username" 
                required 
                placeholder="Grandmaster77"
                onChange={handleChange} 
                className="w-full rounded-2xl border border-white/5 bg-black/20 px-5 py-4 text-sm font-bold text-white outline-none transition focus:border-indigo-500/50" 
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Create Password
              </label>
              <input 
                type="password" 
                name="password" 
                required 
                placeholder="••••••••"
                onChange={handleChange} 
                className="w-full rounded-2xl border border-white/5 bg-black/20 px-5 py-4 text-sm font-bold text-white outline-none transition focus:border-indigo-500/50" 
              />
            </div>

            <button 
              type="submit" 
              className="mt-4 w-full rounded-2xl bg-indigo-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98]"
            >
              Initialize Account
            </button>
          </form>

          <footer className="pt-4 text-center">
            <p className="text-xs font-bold text-slate-500">
              Already a member?{" "}
              <Link to="/signin" className="text-indigo-400 underline underline-offset-4 hover:text-indigo-300">
                Sign in here
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default SignUp;