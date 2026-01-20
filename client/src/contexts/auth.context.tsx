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
      window.location.href = '/'
    }catch(err){
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
      window.location.href = '/'
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
  const signOut = async () => {
    const toastId = toast.loading('Signing out...')
    try {
      const res = await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        credentials: "include"
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          autoClose: 3000,
          isLoading: false
        })
      }
      
      setUser(null)
      
      toast.update(toastId, {
        render: 'Signed out successfully!',
        type: "success",
        autoClose: 3000,
        isLoading: false
      })
      
      window.location.href = '/signout'
    }catch(err){
      toast.update(toastId,{
        render: err.message,
        type: "error",
        autoClose: 3000,
        isLoading: false
      })
    }
  }
  const changeProfilePicture = async (file) => {
    const toastId = toast.loading('Changing profile picture...')
    try {
      const formData = new FormData()
      formData.append('file', file)
      console.log(file)
      const res = await fetch(`${API_URL}/auth/change-profile-picture`, {
        method: 'POST',
        body: formData,
        credentials: "include"
      })
      const data = await res.json()
      
      if (!res.ok) {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          autoClose: 3000,
          isLoading: false
        })
      }
      
      toast.update(toastId, {
        render: 'Profile picture changed successfully!',
        type: "success",
        autoClose: 3000,
        isLoading: false
      })
      
      console.log(data)
      setUser(data.updatedUser)
    } catch (err) {
      toast.update(toastId, {
        render: err.message,
        type: "error",
        autoClose: 3000,
        isLoading: false
      })
    }
  }
  
  return (
    <AuthContext.Provider value={{ user, signup, signin , googleAuth , loading , signOut , changeProfilePicture}}>
      {children}
    </AuthContext.Provider>
  )
}