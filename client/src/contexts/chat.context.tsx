import { createContext, useContext , useEffect , useState } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "./utils/socket.context";

const API_URL = import.meta.env.VITE_API_URL + "/chats"

const ChatContext = createContext()

export const useChat = () => useContext(ChatContext)

const ChatProvider = ({ children }) => {
  
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [chatId, setChatId] = useState(null)
  
  const socket = useSocket()

  const redirect = useNavigate()
  
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
  
  const sendMessage = async ({chatId , message }) => {
    socket.emit("send-message", { chatId, message })
  }
  
  useEffect(() => {
    socket.on("message-sent", message => {
      if (!socket) {
          console.warn("ChatProvider: Socket not initialized yet");
          return;
      }
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
  
  const getSpecificChat = async (friendId) => {
    const existingChat = chats.find(chat => 
      chat.users.some(u => u._id === friendId)
    )
    
    if (existingChat) {
      redirect(`/chat/${existingChat._id}`)
    }
  }
  
  return (
    <ChatContext.Provider value={{chats, currentChat, chatId , setChatId , createChat, getChat , sendMessage , socket, getSpecificChat}}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider