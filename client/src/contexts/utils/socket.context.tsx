import { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../auth.context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }) => {
  const navigate = useNavigate()
  const {user} = useAuth()
  
  const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true
  }), [])
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected")
    })
    
    socket.on("receive-invite", (data) => {
      toast.info(`${data.sender.username} has invited you to a game click to accept`, {
        onClick: () => {
          window.location.href = `${import.meta.env.VITE_CLIENT_URL}/game/${data.gameId}`;
        }
      })
    })
    
    return () => {
      socket.off("receive-invite")
      socket.disconnect()
    }
  }, [socket , navigate])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider