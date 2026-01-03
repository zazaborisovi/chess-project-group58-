import { Navigate } from "react-router";
import { useAuth } from "../auth.context";

export const Protect = ({children}) => {
  const {user , loading} = useAuth();
  
  if(loading) return <div>Loading...</div>
  
  return !loading && user._id ? <>{children}</> : <Navigate to="/signin"/>;
}