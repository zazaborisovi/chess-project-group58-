import { useAuth } from "../contexts/auth.context";
import {useForm} from "../hooks/useForm";

const Signin = () =>{
  const { signin , googleAuth } = useAuth();
  const [formData, handlechange] = useForm({
    email: '',
    password: '',
  })
  
  const handlesubmit = async (e) => {
    e.preventDefault();
    await signin(formData);
  }
  
  return(
    <div>
      <button onClick={googleAuth}>Google Sign In</button>
      <form onSubmit={handlesubmit}>
        <input type="email" name="email" placeholder="Email" required onChange={handlechange}/>
        <input type="password" name="password" placeholder="Password" required onChange={handlechange}/>
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}
export default Signin;