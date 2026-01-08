import { createContext , useContext, useEffect, useState } from 'react';

const LeaderBoardContext = createContext()

export const useLeaderBoard = () => useContext(LeaderBoardContext)

const LeaderBoardProvider = ({children}) =>{
  const [leaderboard , setLeaderBoard] = useState([])
  
  useEffect(() => {
    const fetchLeaderboard = async () =>{
      const res = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard`)
      
      const data = await res.json()
      
      if(!res.ok) return console.log(data.message)
      
      setLeaderBoard(data)
    }
    fetchLeaderboard()
  }, [])
}