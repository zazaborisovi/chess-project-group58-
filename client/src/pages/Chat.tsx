import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useChat } from "../contexts/chat.context";
import { useForm } from "../hooks/useForm";
import { useAuth } from "@/contexts/auth.context";

const ChatPage = () => {  
  const { chatId } = useParams();
  const { user } = useAuth();
  const { getChat, currentChat, sendMessage, setChatId } = useChat();
  const [formData, handleChange] = useForm({ message: "" });
  const scrollRef = useRef(null);
  const friend = currentChat?.users?.find(u => u._id !== user._id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [currentChat?.messages]);

  useEffect(() => {
    setChatId(chatId);
    getChat(chatId);
  }, [chatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    await sendMessage({ chatId, message: formData.message });
    e.target.reset();
    formData.message = "";
  };

  return (
    <div className="flex flex-1 flex-col w-full h-screen bg-[#0b0f1a] overflow-hidden">

      {/* HEADER: Floating Glass Design */}
      <header className="z-20 flex shrink-0 items-center border-b border-white/5 bg-slate-900/40 px-4 py-3 md:px-8 md:py-4 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={friend?.profilePicture?.url || `https://ui-avatars.com/api/?name=${friend?.username}&background=6366f1&color=fff`} 
              className="size-10 md:size-12 rounded-2xl border border-white/10 object-cover shadow-2xl" 
              alt="Avatar"
            />
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-sm md:text-base font-black tracking-tight text-white">
              {friend?.username || "Opponent"}
            </h2>
          </div>
        </div>
      </header>

      {/* MESSAGES AREA */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-12 lg:px-24 space-y-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {currentChat?.messages?.length ? (
          currentChat.messages.map((item, index) => {
            const isMe = item.sender._id === user?._id;
            
            return (
              <div key={index} className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                {!isMe && (
                  <img 
                    src={friend?.profilePicture?.url || `https://ui-avatars.com/api/?name=${friend?.username}&background=6366f1&color=fff`} 
                    alt="" 
                    className="size-7 md:size-8 rounded-lg object-cover border border-white/10 mb-1 shadow-lg" 
                  />
                )}
                
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] md:max-w-[60%]`}>
                  <span className="mt-1.5 px-1 text-[9px] font-bold tracking-tighter text-slate-600">
                    {isMe ? "Sent" : friend?.username}
                  </span>
                  <div className={`px-4 py-3 text-sm font-medium transition-all shadow-xl ${
                    isMe 
                      ? "bg-indigo-600 text-white rounded-2xl rounded-br-none" 
                      : "bg-slate-800/90 text-slate-100 rounded-2xl rounded-bl-none border border-white/5 backdrop-blur-sm"
                  }`}>
                    {item.message}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4 opacity-20">
            <div className="h-[1px] w-24 bg-white/20"></div>
            <p className="text-[10px] font-black uppercase tracking-[1em] text-white">Battle Logs</p>
            <div className="h-[1px] w-24 bg-white/20"></div>
          </div>
        )}
      </div>

      {/* FOOTER: Fixed Input area */}
      <footer className="z-20 bg-slate-950/80 p-4 md:p-6 border-t border-white/5 backdrop-blur-2xl">
        <form 
          onSubmit={handleSubmit} 
          className="mx-auto flex max-w-5xl items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5 focus-within:border-indigo-500/50 focus-within:bg-white/[0.07] transition-all duration-500"
        >
          <input 
            type="text" 
            placeholder="Type your message..." 
            name="message" 
            onChange={handleChange} 
            className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-slate-600 font-medium" 
            autoComplete="off"
          />
          <button 
            type="submit" 
            className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:scale-90 transition-all shadow-lg shadow-indigo-600/30"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 rotate-12">
              <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;