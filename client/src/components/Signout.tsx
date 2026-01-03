import { useAuth } from "../contexts/auth.context"


const Signout = () =>{
  const {signOut} = useAuth()
  
  const handleSignout = async() =>{
    await signOut()
  }
  
  return(
    <button className="bg-red-500 text-white w-50 h-20" onClick={handleSignout}>Sign Out</button>
  )
}

export default Signout