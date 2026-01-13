import { useAuth } from "../contexts/auth.context"
import { useFriends } from "../contexts/friends.context"

const FriendRequestPage = () =>{
  const {user} = useAuth()
  const {requests , acceptFriendRequest , rejectFriendRequest} = useFriends()
  
  return(
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Incoming Challenges</p>
          <h1 className="text-3xl font-semibold">Friend Requests</h1>
          <p className="mt-2 text-sm text-slate-400">Share your UID <span className="font-semibold text-white">#{user._id}</span> to connect with other players.</p>
        </header>

        <div className="grid gap-4">
          {requests.map((request , index) => (
            <article
              key={index}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/30 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Challenger</p>
              <h2 className="text-2xl font-semibold text-white">{request.from.username}</h2>
              <p className="text-sm text-slate-400">UID: {request.from._id}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => acceptFriendRequest(request.from._id)} className="flex-1 rounded-2xl border border-emerald-400 bg-emerald-400/90 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-950 transition hover:bg-emerald-300">Accept</button>
                <button onClick={() => rejectFriendRequest(request.from._id)} className="flex-1 rounded-2xl border border-red-400/70 bg-red-500/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:bg-red-500/30">Reject</button>
              </div>
            </article>
          ))}
          {!requests.length && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-slate-400">
              No pending requests. Share your UID to invite friends.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FriendRequestPage