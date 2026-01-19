import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { useFriends } from "../contexts/friends.context";
import { useChat } from "@/contexts/chat.context";
import { initBoard } from "@/chess/init.board";
import { useNavigate } from "react-router";
import { useChess } from "@/contexts/chess.context";
import { useSocket } from "@/contexts/utils/socket.context";

const Friends = () => {
  const [formData, handleChange] = useForm({ friendId: "" });
  const socket = useSocket();
  const { friends, sendFriendRequest, removeFriend , handleInvite } = useFriends();
  const { getSpecificChat } = useChat();
  const { createPrivateGame , joinGame} = useChess();
  const [openMenu, setOpenMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sendFriendRequest(formData);
  };

  const filteredFriends = friends.filter((friend) =>
    friend?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteClick = async(userId) => {
    try {
      const data = await createPrivateGame()
      if (data && data.gameId) {
            socket.emit("invite-user", {
              userId: userId,
              gameId: data.gameId
            });
            setTimeout(() => {
              joinGame(data.gameId)
            }, 150);
          }
    } catch (error) {
        console.error("Failed to create room:", error);
    }
  };

  
  return (
    <section className="min-h-screen bg-[#0b0f1a] px-4 py-16 text-slate-200">
      <div className="mx-auto w-full max-w-3xl">
        
        {/* Header Section - Larger Text */}
        <header className="mb-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Social</h1>
              <p className="text-base text-slate-400 mt-2">Manage your connections and game invites.</p>
            </div>
            
            <form 
              onSubmit={handleSubmit} 
              className="relative flex items-center gap-3 w-full md:w-auto"
            >
              <div className="relative flex-1 md:w-72">
                <input
                  type="text"
                  name="friendId"
                  onChange={handleChange}
                  placeholder="Invite by Player ID..."
                  className="w-full border-b-2 border-slate-800 bg-transparent px-1 py-3 text-base outline-none transition-all focus:border-indigo-500 placeholder:text-slate-600"
                />
              </div>
              <button 
                type="submit" 
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95 whitespace-nowrap"
              >
                Send Request
              </button>
            </form>
          </div>
        </header>

        {/* Search Bar - Larger and more prominent */}
        <div className="mb-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl bg-slate-900/60 border border-slate-800 py-4 pl-12 pr-4 text-base outline-none transition-all focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {/* Friends List Container */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 whitespace-nowrap">
              Your Connections ({filteredFriends.length})
            </h2>
            <span className="h-[1px] flex-1 bg-slate-800"></span>
          </div>

          <div className="flex flex-col gap-4">
            {filteredFriends.map((friend, index) => (
              <article
                key={index}
                className="group relative flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-5 transition-all hover:border-indigo-500/30 hover:bg-slate-900/60 sm:flex-row"
              >
                {/* Left: Identity - Larger Avatar and Text */}
                <div className="flex w-full items-center gap-5 sm:w-auto">
                  <div className="relative">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-800 transition-transform group-hover:scale-105">
                      <img 
                        src={friend?.profilePicture?.url} 
                        alt="Avatar" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-white transition-colors">
                      {friend?.username}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                      ID: {friend?.id?.slice(0 , -10)}...
                    </p>
                  </div>
                </div>

                {/* Right: Actions - Larger Buttons */}
                <div className="flex w-full items-center gap-3 sm:w-auto">
                  <button 
                    onClick={() => getSpecificChat(friend.id)}
                    className="flex-1 rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold text-slate-300 transition hover:bg-white hover:text-slate-950 sm:flex-none"
                  >
                    Message
                  </button>
                  <button className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 sm:flex-none shadow-lg shadow-indigo-900/20" onClick={() => handleInviteClick(friend.id)}>
                    Invite
                  </button>
                  
                  {/* More Options Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setOpenMenu(openMenu === index ? null : index)}
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition"
                    >
                      <span className="text-2xl font-bold">...</span>
                    </button>

                    {openMenu === index && (
                      <div className="absolute right-0 top-14 z-50 w-48 rounded-xl border border-slate-800 bg-[#161b2a] p-2 shadow-2xl">
                        <button 
                          className="w-full rounded-lg px-4 py-3 text-left text-sm font-bold text-red-400 transition hover:bg-red-500/10"
                          onClick={() => removeFriend(friend.id)}
                        >
                          Remove Friend
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {filteredFriends.length === 0 && (
              <div className="py-24 text-center rounded-2xl border-2 border-dashed border-slate-800/50">
                <p className="text-base font-medium text-slate-500">
                  {searchTerm ? `No results for "${searchTerm}"` : "Your friends list is empty."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Friends;