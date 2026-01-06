import { useNavigate } from "react-router"
import { useAuth } from "../../contexts/auth.context"

const NavComponent = () => {
  const {user} = useAuth()
  const navigate = useNavigate()
  
  return(
    <div className="w-full p-2">
      {user ? (
        <div className="flex items-center justify-evenly">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={() => navigate("/")}>Play</button>
          <button onClick={() => navigate("/leaderboard")}>LeaderBoard</button>
          <div className="flex gap-5">
            <button onClick={() => navigate("/friends")}>Friends</button>
            <button onClick={() => navigate("/friend-requests")}>Friend Requests</button>
          </div>
          <button>Dark Mode</button>
        </div>
      ):(
        <div className="flex gap-5">
          <button onClick={() => navigate("/signin")}>Sign In</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      )}
    </div>
  )
}

export default NavComponent;