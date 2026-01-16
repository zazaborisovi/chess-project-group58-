import { useAuth } from "../contexts/auth.context"
import { useFriends } from "../contexts/friends.context"

const FriendRequestPage = () => {
  const { user } = useAuth()
  const { requests, acceptFriendRequest, rejectFriendRequest } = useFriends()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user._id);
    // You could trigger a toast here
    alert("UID Copied!");
  };

  return (
    <section className="min-h-screen bg-[#0b0f1a] px-4 py-16 text-slate-200">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        
        {/* Header Section */}
        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Requests</h1>
          <p className="text-base text-slate-400">
            Players who want to connect with you. 
            <span className="block mt-2 md:inline md:mt-0 md:ml-2">
              Your ID: 
              <button 
                onClick={copyToClipboard}
                className="ml-2 font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors border-b border-indigo-500/30"
              >
                #{user._id}
              </button>
            </span>
          </p>
        </header>

        {/* Requests List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 whitespace-nowrap">
              Pending Inbox ({requests.length})
            </h2>
            <span className="h-[1px] flex-1 bg-slate-800"></span>
          </div>

          {requests.map((request, index) => (
            <article
              key={index}
              className="group relative flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition-all hover:border-indigo-500/30 hover:bg-slate-900/50 sm:flex-row"
            >
              {/* Profile Info */}
              <div className="flex w-full items-center gap-5 sm:w-auto">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-800">
                  {/* Assuming request.from has a profile picture, otherwise use initial */}
                  {request.from.profilePicture?.url ? (
                    <img src={request.from.profilePicture.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold text-indigo-500">
                      {request.from.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-white">
                    {request.from.username}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    UID: {request.from._id?.slice(-10)}
                  </p>
                </div>
              </div>

              {/* Action Buttons - Larger for accessibility */}
              <div className="flex w-full items-center gap-3 sm:w-auto">
                <button 
                  onClick={() => rejectFriendRequest(request.from._id)} 
                  className="flex-1 rounded-xl bg-slate-800 px-6 py-4 text-sm font-bold text-slate-300 transition hover:bg-red-500/10 hover:text-red-400 sm:flex-none"
                >
                  Decline
                </button>
                <button 
                  onClick={() => acceptFriendRequest(request.from._id)} 
                  className="flex-1 rounded-xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-900/20 transition hover:bg-indigo-500 active:scale-95 sm:flex-none"
                >
                  Accept
                </button>
              </div>
            </article>
          ))}

          {!requests.length && (
            <div className="py-24 text-center rounded-2xl border-2 border-dashed border-slate-800/50 flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-base font-medium text-slate-500">Your inbox is clear.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FriendRequestPage