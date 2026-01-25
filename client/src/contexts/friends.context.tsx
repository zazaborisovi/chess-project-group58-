import { createContext , useContext, useEffect, useState } from "react";
import { useChat } from "./chat.context";
import { useSocket } from "./utils/socket.context";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL + "/friends"

const FriendContext = createContext()

export const useFriends = () => useContext(FriendContext)

const FriendProvider = ({ children }) => {
  const socket = useSocket()
  const {createChat} = useChat()
  const [friends , setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [loading , setLoading] = useState(true)
  
  const refreshData = async() => {
    try {
      const [friendsRes, requestRes] = await Promise.all([
        fetch(`${API_URL}/`, {credentials: "include"}),
        fetch(`${API_URL}/requests`, {credentials: "include"})
      ])
      
      const friendData = await friendsRes.json()
      const requestData = await requestRes.json()
      
      console.log(friendData, requestData)
      if(friendsRes.ok) setFriends(friendData.friends)
      if(requestRes.ok) setRequests(requestData.requests)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    refreshData()
  }, [])
  
  const sendFriendRequest = async (friendId) => {
    const toastId = toast.loading("Sending friend request...")
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
      
      if(!res.ok) {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
      
      toast.update(toastId, {
        render: "Friend request sent successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })
      
      await refreshData()
    }catch(err){
      console.log(err)
    }
  }
  
  const acceptFriendRequest = async (friendId) => {
    const toastId = toast.loading("Accepting friend request...")
    try{
      const res = await fetch(`${API_URL}/accept-friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({fromUserId: friendId}),
        credentials: "include"
      })

      const data = await res.json()
      
      if(!res.ok) {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
      
      toast.update(toastId, {
        render: "Friend request accepted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })
      
      await refreshData()
      await createChat(friendId)
    }catch(err){
      console.log(err)
    }
  }
  
  const rejectFriendRequest = async (friendId) => {
    const toastId = toast.loading("Rejecting friend request...")
    try {
      const res = await fetch(`${API_URL}/reject-friend-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({fromUserId: friendId}),
        credentials: "include"
      })

      const data = await res.json()
      
      if(!res.ok) {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
      
      toast.update(toastId, {
        render: "Friend request rejected successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })
      await refreshData()
      console.log(data.message)
    } catch (err) {
      console.log(err)
    }
  }
  
  const removeFriend = async (friendId) => {
    const toastId = toast.loading("Removing friend...")
    try {
      const res = await fetch(`${API_URL}/remove-friend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({friendId}),
        credentials: "include"
      })

      const data = await res.json()
      
      if (!res.ok) {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
      
      toast.update(toastId, {
        render: "Friend removed successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })
      
      console.log(data.message)
      await refreshData()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(true)
    }
  }
  
  const handleInvite = (data) => {
    socket.emit("invite-user" , {userId: data.userId , gameId: data.gameId})
  }
  
  return(
    <FriendContext.Provider value={{friends , sendFriendRequest , requests , acceptFriendRequest , rejectFriendRequest , removeFriend , handleInvite}}>
      {children}
    </FriendContext.Provider>
  )
}

export default FriendProvider