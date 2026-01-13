import { useEffect } from "react";
import { useParams } from "react-router";
import { useChat } from "../contexts/chat.context";
import { useForm } from "../hooks/useForm";
import { useAuth } from "@/contexts/auth.context";

const ChatPage = () => {  
  const { chatId } = useParams()
  const {user} = useAuth()
  
  const { getChat, currentChat , sendMessage , setChatId , socket} = useChat()
  
  const [formData, handleChange] = useForm({message: ""})
  
  useEffect(() => {
    setChatId(chatId)
    getChat(chatId)
    
    socket.emit("join-chat", chatId)    
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage({ chatId, message: formData.message, senderId: user._id })
  }
  
  return (
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100 h-full">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur h-[85vh]">
        <header className="border-b border-white/10 pb-4">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Chat Room</p>
          <h1 className="text-2xl font-semibold">Strategize with your ally</h1>
        </header>

        <div className="flex-1 space-y-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4 overflow-y-scroll">
          {currentChat?.messages?.length ? (
            currentChat.messages.map((item , index) => (
              <div key={index} className={`flex ${item.senderId === user._id ? "justify-start" : "justify-end"}`}>
                <p className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                  item.senderId === user._id ? "bg-white/10 text-white" : "bg-emerald-500/80 text-emerald-950"
                }`}>
                  {item.message}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-slate-500">No messages yet. Say hi!</p>
          )}
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-3 sm:flex-row">
          <input type="text" placeholder="enter message" name="message" onChange={handleChange} className="flex-1 rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400" />
          <button type="submit" className="rounded-2xl border border-emerald-400 bg-emerald-400/90 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300">Send</button>
        </form>
      </div>
    </section>
  )
}

export default ChatPage