import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useChat } from "../contexts/chat.context";
import { useForm } from "../hooks/useForm";
import { useAuth } from "@/contexts/auth.context";

const ChatPage = () => {  
  const { chatId } = useParams();
  const { user } = useAuth();
  const { getChat, currentChat, sendMessage, setChatId, socket } = useChat();
  const [formData, handleChange] = useForm({ message: "" });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  useEffect(() => {
    socket.emit("join-chat", chatId);
    setChatId(chatId);
    getChat(chatId);
  }, [chatId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    sendMessage({ chatId, message: formData.message });
    e.target.reset();
    formData.message = ""
  };

  return (
    // Removed large padding on mobile (p-0) and kept it on desktop (md:py-8)
    <section className="flex h-screen flex-col bg-[#0b0f1a] text-slate-200 md:h-[calc(100vh-80px)] md:px-4 md:py-8">
      
      {/* Main Container: Full screen on mobile, max-width card on desktop */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-hidden bg-slate-900/10 md:rounded-2xl md:border md:border-slate-800 md:shadow-2xl">
        
        {/* Header: Sticky at top */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-indigo-400">
                {/* Visual placeholder for partner's initial */}
                P
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0b0f1a] bg-emerald-500"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Match Chat</h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Room: {chatId?.slice(-6)}</p>
            </div>
          </div>
          
          <button className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition">
            Close
          </button>
        </header>

        {/* Message Area: flex-1 allows it to grow/shrink */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          {currentChat?.messages?.length ? (
            currentChat.messages.map((item, index) => {
              const isMe = item.sender === user._id;
              return (
                <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`group flex max-w-[85%] flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-2.5 text-sm shadow-md transition-all ${
                      isMe 
                        ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none" 
                        : "bg-slate-800 text-slate-100 rounded-2xl rounded-tl-none border border-slate-700/50"
                    }`}>
                      {item.message}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex h-full flex-col items-center justify-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Messages</p>
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="bg-slate-900/60 p-4 border-t border-slate-800 backdrop-blur-md">
          <form 
            onSubmit={handleSubmit} 
            className="mx-auto flex max-w-4xl items-center gap-3"
          >
            <div className="flex flex-1 items-center rounded-xl bg-slate-950/50 px-4 ring-1 ring-slate-800 focus-within:ring-indigo-500 transition-all">
              <input 
                type="text" 
                placeholder="Message..." 
                name="message" 
                onChange={handleChange} 
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600" 
                autoComplete="off"
              />
            </div>
            <button 
              type="submit" 
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 active:scale-90"
            >
              {/* Simple Send Arrow Icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 rotate-260">
                <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ChatPage;