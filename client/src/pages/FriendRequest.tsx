import { useAuth } from "../contexts/auth.context"
import { useFriends } from "../contexts/friends.context"

const FriendRequestPage = () =>{
  const {user} = useAuth()
  const {sendFriendRequest , requests , acceptFriendRequest} = useFriends()
  
  return(
    <>
      <h1>
        Friend Requests
        <p>your UID: {user._id}</p>
      </h1>
      {
        requests.map((request , index) => (
          <div className="flex *:flex flex-col gap-2 text-xl border-2 border-gray-500 w-fit p-2 rounded-lg">
            <p className="flex text-center flex-col"> from: {request.from.username} <span className="text-sm text-gray-500 self-start">UID: {request.from._id}</span></p>
            <div className="flex justify-around *:p-2 *:w-[50%] border-t-2 *:mt-2 *:border-2">
              <button onClick={() => acceptFriendRequest(request.from._id)} className="bg-green-500">Accept</button>
              <button onClick={() => console.log("rejected that mf")} className="bg-red-600">Reject</button>
            </div>
          </div>
        ))
      }
    </>
  )
}

export default FriendRequestPage