import { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true
  }), [])
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected")
    })
    
    return () => {
      socket.disconnect()
    }
  }, [socket])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider