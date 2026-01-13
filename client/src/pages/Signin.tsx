import { useAuth } from "../contexts/auth.context";
import {useForm} from "../hooks/useForm";

const Signin = () =>{
  const { signin , googleAuth } = useAuth();
  const [formData, handlechange] = useForm({
    email: '',
    password: '',
  })
  
  const handlesubmit = async (e) => {
    e.preventDefault();
    await signin(formData);
  }
  
  return(
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Welcome Back</p>
          <h1 className="text-3xl font-semibold">Sign in to ReChess</h1>
          <p className="text-sm text-slate-400">Sharpen your mind and pick up where you left off.</p>
        </div>
        <button
          onClick={googleAuth}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold tracking-[0.3em] text-white transition hover:border-emerald-400"
        >
          Continue with Google
        </button>
        <form onSubmit={handlesubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
            <input type="email" name="email" placeholder="Email" required onChange={handlechange} className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold tracking-wide text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"/>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Password</label>
            <input type="password" name="password" placeholder="Password" required onChange={handlechange} className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold tracking-wide text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"/>
          </div>
          <button type="submit" className="w-full rounded-2xl border border-emerald-400 bg-emerald-400/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300">Sign In</button>
        </form>
      </div>
    </section>
  )
}
export default Signin;