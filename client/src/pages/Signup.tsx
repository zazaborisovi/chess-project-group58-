import { useForm } from '../hooks/useForm';
import { useAuth } from '../contexts/auth.context';
import { Link } from "react-router";

const SignUp = () => {
  const { signup } = useAuth();
  const [formData, handleChange] = useForm({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#0b0f1a] px-6 py-24">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        
        {/* Decorative Background Glow */}
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

          {/* Signin Redirect */}
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