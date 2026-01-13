import { createContext, useContext , useEffect , useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./auth.context";

const API_URL = import.meta.env.VITE_API_URL + "/chats"

const ChatContext = createContext()

export const useChat = () => useContext(ChatContext)

const ChatProvider = ({ children }) => {
  const user = useAuth()
  
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [chatId, setChatId] = useState(null)
  
  const socket = io(import.meta.env.VITE_BACKEND_URL)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`${API_URL}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        
        const data = await res.json()
        
        if (!res.ok) return console.log(data.error)
        
        console.log(data)
        setChats(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchChats()
  }, [])
  
  const sendMessage = async ({chatId , message , senderId}) => {
    socket.emit("send-message", { chatId, message , senderId })
  }
  
  useEffect(() => {
    socket.on("message-sent", message => {
      console.log(message)
      setCurrentChat((prev) => ({
        ...prev,
        messages: [...prev.messages, message]
      }))
    })
    
    return () => socket.off("message-sent")
  }, [])
  
  const createChat = async (friendId) => {
    try {
      const res = await fetch(`${API_URL}/create-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ friendId: friendId })
      })
      
      const data = await res.json()
      
      if (!res.ok) return console.log(data.error)
      
      setChats((prev) => [...prev, data])
    } catch (err) {
      console.log(err)
    }
  }

  const getChat = async (chatId) => {
    try {
      console.log(chatId)
      const res = await fetch(`${API_URL}/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      const data = await res.json()
      
      if (!res.ok) return console.log(data.error)
      
      console.log(data)
      setCurrentChat(data)
      socket.emit("join-chat", chatId)
    } catch (err) {
      console.log(err)
    }
  }
  
  return (
    <ChatContext.Provider value={{chats, currentChat, chatId , setChatId , createChat, getChat , sendMessage , socket}}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider