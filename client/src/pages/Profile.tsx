import { useFriends } from "@/contexts/friends.context"
import { useAuth } from "../contexts/auth.context"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useRef, useState } from "react";
import { useChat } from "@/contexts/chat.context";
import { useNavigate } from "react-router";

const ProfilePage = () => {
  const { user, changeProfilePicture } = useAuth()
  const redirect = useNavigate()
  
  const getSpecificChat = async (friendId) => {
    let chat = chats.some(chat => chat.users.find(user => user._id === friendId))
    
    if (chat) {
      const chatId = chats.find(chat => chat._id)._id
      redirect(`/chat/${chatId}`)
    }
  }
  
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(user?.profilePicture?.url)
  
  const { friends } = useFriends()
  const {getChat , chats} = useChat()
  
  const handlephotoupload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      changeProfilePicture(file)
    }
  }
  const handleClick = () => {
    fileInputRef.current.click()
  }
  
  return (
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Card className="border-white/10 bg-white/5 text-white shadow-2xl shadow-black/40 backdrop-blur">
          <CardHeader className="flex flex-col items-center gap-4 text-center">
            <CardTitle className="text-3xl font-semibold">{user.username}</CardTitle>
            <input type="file" onChange={(e) => handlephotoupload(e)} className="hidden" ref={fileInputRef}/>
            <img src={preview} alt="Profile Picture" className="h-36 w-36 cursor-pointer rounded-full border-4 border-white/20 object-cover shadow-lg" onClick={handleClick} />
            <p className="text-sm text-slate-400">Tap your avatar to update it instantly.</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-6 text-center text-sm uppercase tracking-[0.3em] text-slate-400">
              <div>
                <p className="text-xs">UID</p>
                <p className="font-mono text-lg text-white">#{user._id}</p>
              </div>
              <div>
                <p className="text-xs">Friends</p>
                <p className="text-lg font-semibold text-white">{friends.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Allies</p>
              <h2 className="text-2xl font-semibold">Chess companions</h2>
            </div>
            <button className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">View all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {friends.map((friend, index) => (
              <Card key={index} className="w-56 flex-shrink-0 border-white/10 bg-slate-950/40 text-white">
                <CardHeader className="flex items-center justify-center">
                  <img src={friend?.profilePicture?.url} alt="Friend Profile" className="h-20 w-20 rounded-full border-2 border-white/20 object-cover" />
                </CardHeader>
                <CardContent className="space-y-2 text-center">
                  <h3 className="text-lg font-semibold">{friend?.username}</h3>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 break-all">#{friend?.id}</p>
                </CardContent>
                <CardFooter>
                  <button className="w-full rounded-2xl border border-emerald-400 bg-emerald-400/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-950 transition hover:bg-emerald-300" onClick={() => getSpecificChat(friend.id)}>Open Chat</button>
                </CardFooter>
              </Card>
            ))}
            {!friends.length && (
              <div className="flex h-40 w-full flex-1 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-slate-400">
                No allies yet. Add friends to see them here.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
  
}

export default ProfilePage