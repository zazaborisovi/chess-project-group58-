import { useAuth } from "../contexts/auth.context";
import { useForm } from "../hooks/useForm";
import { Link } from "react-router";

const Signin = () => {
  const { signin, googleAuth } = useAuth();
  const [formData, handlechange] = useForm({
    email: '',
    password: '',
  });

  const handlesubmit = async (e) => {
    e.preventDefault();
    await signin(formData);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#0b0f1a] px-6 py-24">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        
        {/* Decorative Background Glow */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]" />
        
        <div className="relative z-10 space-y-8">
          <header className="space-y-3 text-center">
            <span className="rounded-full bg-indigo-500/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
              Welcome Back
            </span>
            <h1 className="text-4xl font-black tracking-tighter text-white">Sign In</h1>
            <p className="text-sm font-medium text-slate-500">
              Sharpen your mind and pick up where you left off.
            </p>
          </header>

          {/* Social Auth */}
          <button
            onClick={googleAuth}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white px-6 py-4 transition-all hover:bg-slate-200 active:scale-[0.98]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-xs font-black uppercase tracking-widest text-black">Google Account</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">OR</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          {/* Manual Auth */}
          <form onSubmit={handlesubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required 
                onChange={handlechange} 
                className="w-full rounded-2xl border border-white/5 bg-black/20 px-5 py-4 text-sm font-bold text-white outline-none transition focus:border-indigo-500/50"
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                onChange={handlechange} 
                className="w-full rounded-2xl border border-white/5 bg-black/20 px-5 py-4 text-sm font-bold text-white outline-none transition focus:border-indigo-500/50"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full rounded-2xl bg-indigo-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98]"
            >
              Sign Into Arena
            </button>
          </form>

          {/* Signup Redirect */}
          <footer className="pt-4 text-center">
            <p className="text-xs font-bold text-slate-500">
              New to ReChess?{" "}
              <Link to="/signup" className="text-indigo-400 underline underline-offset-4 hover:text-indigo-300">
                Create an account
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default Signin;