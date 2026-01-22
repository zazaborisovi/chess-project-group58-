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
  const friend = currentChat?.users?.find(u => u._id !== user._id)

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
    /* flex-1 makes it fill the whole screen under the Nav */
    <div className="flex flex-1 flex-col w-screen h-screen bg-[#0b0f1a] overflow-hidden">

      {/* HEADER: Full width, flush with top */}
      <header className="flex shrink-0 items-center justify-between border-b border-white/5 bg-slate-900/40 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <div className="text-white text-xl flex gap-2 items-center">
              <img src={friend?.profilePicture?.url} className="rounded-xl" />
              {friend?.username}
            </div>
          </div>
        </div>
      </header>

      {/* MESSAGES: Full width scroll area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 md:px-12 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent"
      >
        {currentChat?.messages?.length ? (
          currentChat.messages.map((item, index) => {
            const isMe = item.sender._id === user?._id;
            
            return (
              <div key={index} className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {!isMe && (
                  <img 
                    src={friend?.profilePicture?.url || `https://ui-avatars.com/api/?name=${friend?.username}&background=6366f1&color=fff`} 
                    alt="" 
                    className="size-8 rounded-lg object-cover border border-white/10 mb-1 shadow-lg" 
                  />
                )}
                
                <div className={`flex flex-col max-w-[80%] md:max-w-[50%]`}>
                  {!isMe && (
                    <span className="text-[10px] font-black text-slate-600 tracking-widest mb-1.5 ml-1">
                      {friend?.username}
                    </span>
                  )}

                  <div className={`px-5 py-3 text-[13px] leading-relaxed shadow-sm transition-all ${
                    isMe 
                      ? "bg-indigo-600 text-white rounded-2xl rounded-br-none" 
                      : "bg-slate-800/80 text-slate-200 rounded-2xl rounded-bl-none border border-white/5"
                  }`}>
                    {item.message}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center opacity-10">
            <p className="text-[11px] font-black uppercase tracking-[1em]">Beginning of Chat</p>
          </div>
        )}
      </div>

      {/* FOOTER: Full width input area */}
      <footer className="bg-slate-950/60 p-6 border-t border-white/5 backdrop-blur-xl">
        <form 
          onSubmit={handleSubmit} 
          className="mx-auto flex max-w-6xl items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-white/10 ring-1 ring-white/5 focus-within:ring-indigo-500/30 transition-all duration-300"
        >
          <input 
            type="text" 
            placeholder="Send a message to your opponent..." 
            name="message" 
            onChange={handleChange} 
            className="flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-slate-700 font-medium" 
            autoComplete="off"
          />
          <button 
            type="submit" 
            className="flex h-11 px-6 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
          >
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline mr-2">Send</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
            </svg>
          </button>
        </form>
      </footer>

    </div>
  );
};

export default ChatPage;