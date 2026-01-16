import { useFriends } from "@/contexts/friends.context";
import { useAuth } from "../contexts/auth.context";
import { useRef, useState } from "react";
import { useChat } from "@/contexts/chat.context";

const ProfilePage = () => {
  const { user, changeProfilePicture } = useAuth();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(user?.profilePicture?.url);
  const { friends } = useFriends();
  const { getSpecificChat } = useChat();

  const handlephotoupload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      changeProfilePicture(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="min-h-screen bg-[#0b0f1a] px-4 py-24 text-slate-200">
      <div className="mx-auto w-full max-w-5xl space-y-12">
        
        {/* Main Profile Card (Hero Section) */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          {/* Decorative Background Glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]" />
          
          <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:text-left">
            {/* Avatar Section */}
            <div className="group relative shrink-0">
              <input type="file" onChange={handlephotoupload} className="hidden" ref={fileInputRef} />
              <div 
                onClick={handleClick}
                className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-[2rem] border-4 border-indigo-500/20 shadow-2xl transition-transform active:scale-95 md:h-48 md:w-48"
              >
                <img src={preview} alt="Profile" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">Change Photo</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Identity Info */}
            <div className="flex flex-1 flex-col items-center md:items-start">
              <span className="mb-2 rounded-full bg-indigo-500/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                {user.role || 'Player'} Rank
              </span>
              <h1 className="text-4xl font-black tracking-tighter text-white md:text-6xl">{user.username}</h1>
              <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
                <div className="rounded-2xl bg-white/5 px-6 py-3 border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry ID</p>
                  <p className="font-mono text-sm text-indigo-300">#{user._id.slice(0 , -12)}...</p>
                </div>
                <div className="rounded-2xl bg-white/5 px-6 py-3 border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Companions</p>
                  <p className="text-lg font-black text-white">{friends.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Friends Horizontal Scroll Section */}
        <div className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Your Circle</p>
              <h2 className="text-3xl font-extrabold text-white tracking-tighter">Chess Companions</h2>
            </div>
            <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
              View All
            </button>
          </div>

          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-8 pt-2">
            {friends.length > 0 ? (
              friends.map((friend, index) => (
                <div 
                  key={index} 
                  className="group w-64 shrink-0 rounded-[2rem] border border-white/5 bg-slate-900/40 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900/80"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-2xl border-2 border-white/10 group-hover:border-indigo-500/30">
                      <img src={friend?.profilePicture?.url} alt="" className="h-full w-full object-cover" />
                    </div>
                    <h3 className="text-lg font-bold text-white truncate w-full">{friend?.username}</h3>
                    <p className="mb-6 text-[10px] font-mono text-slate-500 uppercase">ID: {friend?.id?.slice(-6)}</p>
                    
                    <button 
                      onClick={() => getSpecificChat(friend.id)}
                      className="w-full rounded-xl bg-indigo-600 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/10 transition-all hover:bg-indigo-500 active:scale-95"
                    >
                      Open Chat
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex w-full items-center justify-center rounded-[2rem] border-2 border-dashed border-white/5 py-20 text-slate-500 font-bold">
                No allies found. Expand your circle.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;