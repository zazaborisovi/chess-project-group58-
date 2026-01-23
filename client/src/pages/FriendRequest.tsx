import { useAuth } from "../contexts/auth.context";
import { useFriends } from "../contexts/friends.context";
import { useForm } from "../hooks/useForm";
import { toast } from "react-toastify";

const FriendRequestPage = () => {
  const { user } = useAuth();
  const { requests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useFriends();
  const [formData, handleChange] = useForm({ friendId: "" });

  const incoming = requests?.filter((req: any) => req.to?._id === user?._id);
  const outgoing = requests?.filter((req: any) => req.from?._id === user?._id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.friendId) return toast.info("Please enter a Player ID");
    sendFriendRequest(formData);
  };

  const copyToClipboard = () => {
    if (!user?._id) return;
    navigator.clipboard.writeText(user._id);
    toast.success("UID Copied!");
  };

  return (
    <section className="min-h-screen bg-[#0b0f1a] px-4 py-16 text-slate-200">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
        {/* Header and Send Request Form */}
        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Requests
            </h1>
            <p className="text-base text-slate-400">
              Your ID:
              <button
                onClick={copyToClipboard}
                className="ml-2 font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors border-b border-indigo-500/30"
              >
                #{user?._id}
              </button>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                name="friendId"
                value={formData.friendId}
                onChange={handleChange}
                placeholder="Enter Player ID..."
                className="w-full border-b-2 border-slate-800 bg-transparent px-1 py-3 text-base outline-none transition-all focus:border-indigo-500 placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 active:scale-95 whitespace-nowrap shadow-lg shadow-indigo-600/20"
            >
              Add Player
            </button>
          </form>
        </header>

        {/* --- INCOMING SECTION --- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
              Incoming ({incoming?.length || 0})
            </h2>
            <span className="h-[1px] flex-1 bg-slate-800/50"></span>
          </div>

          {incoming?.map((request: any, index: number) => (
            <article
              key={`in-${index}`}
              className="group flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition-all hover:border-indigo-500/30 hover:bg-slate-900/50 sm:flex-row"
            >
              <div className="flex w-full items-center gap-5 sm:w-auto">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-800">
                  <img
                    src={request.from?.profilePicture?.url || "/placeholder-avatar.png"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-white">
                    {request.from?.username}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    UID: {request.from?._id?.slice(0, 8)}...
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center gap-3 sm:w-auto">
                <button
                  onClick={() => rejectFriendRequest(request.from?._id)}
                  className="flex-1 rounded-xl bg-slate-800 px-6 py-3 text-xs font-bold text-slate-300 transition hover:bg-red-500/10 hover:text-red-400 sm:flex-none"
                >
                  Decline
                </button>
                <button
                  onClick={() => acceptFriendRequest(request.from?._id)}
                  className="flex-1 rounded-xl bg-indigo-600 px-8 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-indigo-500 sm:flex-none"
                >
                  Accept
                </button>
              </div>
            </article>
          ))}
          {incoming?.length === 0 && (
            <p className="text-sm text-slate-600 italic px-2">
              No pending requests to show.
            </p>
          )}
        </div>

        {/* --- OUTGOING SECTION --- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
              Outgoing ({outgoing?.length || 0})
            </h2>
            <span className="h-[1px] flex-1 bg-slate-800/50"></span>
          </div>

          {outgoing?.map((request: any, index: number) => (
            <article
              key={`out-${index}`}
              className="flex items-center justify-between gap-6 rounded-2xl border border-slate-800/30 bg-slate-900/10 p-5"
            >
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 grayscale opacity-60">
                  <img
                    src={request.to?.profilePicture?.url || "/placeholder-avatar.png"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-slate-400">
                    {request.to?.username}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-600 uppercase">
                    UID: {request.to?._id?.slice(0, 8)}...
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-700/30">
                  Pending Approval
                </span>
                <button
                  onClick={() => rejectFriendRequest(request.to?._id)}
                  className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </article>
          ))}
          {outgoing?.length === 0 && (
            <p className="text-sm text-slate-600 italic px-2">
              You haven't sent any invites yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FriendRequestPage;