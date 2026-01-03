import {useForm} from '../hooks/useForm';
import { useAuth } from '../contexts/auth.context';

const SignUp = () =>{
  const { signup } = useAuth()
  const [formData , handleChange] = useForm({
    username: '',
    email: '',
    password: '',
  })
  const handleSubmit = async(e) =>{
    e.preventDefault();
    console.log(formData)
    await signup(formData)
  }
  return(
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
export default SignUp;