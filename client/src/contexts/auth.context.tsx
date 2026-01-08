import { useContext, useState , createContext, useEffect} from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL

export const AuthProvider = ({children}) =>{
  const [user , setUser] = useState(null)
  const navigate = useNavigate()
  const [loading , setLoading] = useState(true)
  
  useEffect(() =>{
    const autoLogin = async () => {
      try{
        const res = await fetch(`${API_URL}/auth/auto-signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        
        const data = await res.json()
        
        if (res.ok && data) {
          console.log(data)
          setUser(data)
        } else {
          setUser({})
        }
      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }
    }
    autoLogin()
  }, [])
  
  const signup = async(formData) =>{
    const toastId = toast.loading('Signing up...');
    try{
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      })
      
      const data = await res.json()
      
      if(!res.ok){
        return toast.update(toastId,{
          render: data.message,
          type: "error",
          autoClose: 3000,
          isLoading: false
        })
      }
      setUser(data.user)
      toast.update(toastId,{
        render: 'Signed up successfully!',
        type: "success",
        autoClose: 3000,
        isLoading: false
      })
      navigate("/")
    }catch(err){
      console.log(err)
      toast.update(toastId,{
        render: err,
        type: "error",
        autoClose: 3000,
        isLoading: false
      })
    }
  }
  const signin = async(formData) =>{
    const toastId = toast.loading('Signing in...');
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      })
      const data = await res.json()
      
      if (!res.ok) {
        toast.update(toastId,{
          render: data.message,
          type: "error",
          autoClose: 3000,
          isLoading: false
        })
      }
      setUser(data.user)
      toast.update(toastId,{
        render: 'Signed in successfully!',
        type: "success",
        autoClose: 3000,
        isLoading: false
      })
      navigate("/")
    } catch (err) {
      toast.update(toastId,{
        render: err.message,
        type: "error",
        autoClose: 3000,
        isLoading: false
      })
    }
  }
  const googleAuth = () =>{
    window.location.href = `${API_URL}/oauth/google`
  }
  const signOut = async() =>{
    try{
      const res = await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        credentials: "include"
      })
      
      const data = await res.json()
      
      if(!res.ok) return console.log(data)
      
      setUser(null)
      navigate("/signin")
    }catch(err){
      console.log(err)
    }
  }
  
  return (
    <AuthContext.Provider value={{ user, signup, signin , googleAuth , loading , signOut}}>
      {children}
    </AuthContext.Provider>
  )
}