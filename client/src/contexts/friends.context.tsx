import { createContext , useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL + "/friends"

const FriendContext = createContext()

export const useFriends = () => useContext(FriendContext)

const FriendProvider = ({ children }) =>{
  const [friends , setFriends] = useState([])
  const [requests , setRequests] = useState([])
  
  useEffect(() => {
    const fetchFriends = async () =>{
      try {
        const res = await fetch(`${API_URL}/friends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        })
        
        const data = await res.json()
        
        if (!res.ok) return console.log("some issues fetching friends")
        
        setFriends(data.friends)
      }catch(err){
        console.log(err)
      }
    }
    fetchFriends()
    
    const fetchRequests = async () =>{
      try{
        const res = await fetch(`${API_URL}/requests`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        })
        
        const data = await res.json()
        
        if(!res.ok) return console.log(data.message)
        
        console.log(data)
        
        setRequests(data.requests)
      }catch(err){
        console.log(err)
      }
    }
    fetchRequests()
  }, [])
  
  const sendFriendRequest = async ({friendId}) =>{
    try{
      const res = await fetch(`${API_URL}/send-friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({friendId}),
        credentials: "include"
      })
      
      console.log(friendId)
      
      const data = await res.json()
      
      if(!res.ok) return console.log(data.message)
      
      setFriends([...friends , data.friend])
    }catch(err){
      console.log(err)
    }
  }
  
  const acceptFriendRequest = async (friendId) =>{
    try{
      console.log(friendId)
      const res = await fetch(`${API_URL}/accept-friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({fromUserId: friendId}),
        credentials: "include"
      })

      const data = await res.json()
      
      if(!res.ok) return console.log(data.message)
      
      console.log(data.message)
    }catch(err){
      console.log(err)
    }
  }
  
  return(
    <FriendContext.Provider value={{friends , sendFriendRequest , requests , acceptFriendRequest}}>
      {children}
    </FriendContext.Provider>
  )
}

export default FriendProvider