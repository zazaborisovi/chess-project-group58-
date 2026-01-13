import { useForm } from "../hooks/useForm"
import { useFriends } from "../contexts/friends.context"

const Friends = () =>{
  const [formData , handleChange] = useForm({friendId: ""})
  const {friends , sendFriendRequest} = useFriends()
  
  const handleSubmit = (e) =>{
    e.preventDefault()
    sendFriendRequest(formData)
  }
  
  return(
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Allies in the arena</p>
          <h1 className="text-3xl font-semibold">Your Chess Circle</h1>
          <p className="mt-2 text-sm text-slate-400">Stay connected with rivals-turned-friends and invite new challengers.</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {friends.map((friend , index) =>(
            <article
              key={index}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Username</p>
              <h2 className="text-xl font-semibold">{friend.username}</h2>
              <p className="mt-2 text-sm text-slate-400">ID: {friend.id}</p>
            </article>
          ))}
          {!friends.length && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-400">
              No friends yet. Share your ID and start building your inner circle.
            </div>
          )}
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/30 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Send an invite</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              name="friendId"
              onChange={handleChange}
              placeholder="Enter player ID"
              className="flex-1 rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold tracking-wide text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400"
            />
            <button type="submit" className="rounded-2xl border border-emerald-400 bg-emerald-400/90 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-300">
              Send Request
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Friends