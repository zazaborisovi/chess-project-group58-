import { useEffect, useState } from "react"
import { useAuth } from "../contexts/auth.context"


const Friends = () =>{
  const {user} = useAuth()
  const [friendArr , setFriendArr] = useState ([])
  
  useEffect(() => {
    const fetchFriends = async () =>{
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/friends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        })
        
        const data = await res.json()
        
        if (!res.ok) return console.log("some issues fetching friends")
        
        setFriendArr(data.friends)
      }catch(err){
        console.log(err)
      }
    }
    fetchFriends()
  }, [])
  
  return(
    <div>
      <h1>Friends:</h1>
      <ul>
        {
          friendArr.map((friend , index) =>(
            <li key={index}>Username: {friend.username} ID: {friend.id}</li>
          ))
        }
      </ul>
    </div>
  )
}

export default Friends