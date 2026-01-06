import { useForm } from "../hooks/useForm"
import { useFriends } from "../contexts/friends.context"

const Friends = () =>{
  const [formData , handleChange] = useForm({friendId: ""})
  const {friends , sendFriendRequest} = useFriends()
  
  const handleSubmit = (e) =>{
    e.preventDefault()
    sendFriendRequest(formData)
  }
  
  return(
    <div>
      <h1>Friends:</h1>
      <ul>
        {
          friends.map((friend , index) =>(
            <li key={index}>Username: {friend.username} ID: {friend.id}</li>
          ))
        }
      </ul>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" name="friendId" onChange={handleChange}/>
        <button type="submit">Send Friend Request by id</button>
      </form>
    </div>
  )
}

export default Friends