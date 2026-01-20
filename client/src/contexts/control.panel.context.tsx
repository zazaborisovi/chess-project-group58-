import {createContext , useContext , useState , useEffect} from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const ControlPanelContext = createContext()

export const useControlPanel = () => useContext(ControlPanelContext)

const ControlPanelProvider = ({children}) => {
  const [users , setUsers] = useState([])
  const [refresh , setRefresh] = useState(false)
  
  useEffect(() =>{
    const fetchUsers = async () =>{
      const res = await fetch(`${API_URL}/admin/users` , {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      })
      
      const data = await res.json()
      
      if(!res.ok) return console.log(data.error)
      
      console.log(data)
      setUsers(data)
      setRefresh(false)
    }
    fetchUsers()
  }, [refresh])
  
  const updateUser = async (user) => {
    const toastId = toast.loading("Updating user...")
    try{
      const res = await fetch(`${API_URL}/admin/update-user` , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user)
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        toast.update(toastId, {
          render: data.error,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
      
      toast.update(toastId, {
        render: "User updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })
      
      setUsers((prev) => prev.map(u => u.id === data.id ? data : u))
      setRefresh(!refresh)
    }catch(err){
      console.log(err)
    }
  }
  
  const deleteUser = async (user) => {
    const toastId = toast.loading("Deleting user...")
    try {
      const res = await fetch(`${API_URL}/admin/delete-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: user._id })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        toast.update(toastId, {
          render: data.error,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      }
      
      toast.update(toastId, {
        render: "User deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })
      
      setUsers((prev) => prev.filter(u => u._id !== user._id))
      setRefresh(!refresh)
    } catch (err) {
      console.log(err)
    }
  }
  
  return (
    <ControlPanelContext.Provider value={{users , setUsers , updateUser , refresh , deleteUser}}>
      {children}
    </ControlPanelContext.Provider>
  )
}

export default ControlPanelProvider;