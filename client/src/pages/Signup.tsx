import {useForm} from '../hooks/useForm';
import { useAuth } from '../contexts/auth.context';

const SignUp = () =>{
  const { signup } = useAuth()
  const [formData , handleChange] = useForm({
    username: '',
    email: '',
    password: '',
  })
  const handleSubmit = async(e) =>{
    e.preventDefault();
    console.log(formData)
    await signup(formData)
  }
  return(
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-100 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Create Account</p>
          <h1 className="text-3xl font-semibold">Join the ReChess ranks</h1>
          <p className="text-sm text-slate-400">Unlock leaderboards, friends and live chat.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold tracking-wide text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Username</label>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold tracking-wide text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Password</label>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} className="mt-2 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold tracking-wide text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400" />
          </div>
          <button type="submit" className="w-full rounded-2xl border border-emerald-400 bg-emerald-400/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300">Sign Up</button>
        </form>
      </div>
    </section>
  )
}
export default SignUp;