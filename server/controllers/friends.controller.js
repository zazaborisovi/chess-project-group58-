const User = require("../models/user.model")

const sendFriendRequest = async (req , res) =>{
  try{
    const {friendId} = req.body
    const user = req.user
    
    const sendingTo = await User.findById(friendId)
    
    if(!sendingTo) return res.status(404).json({message: "User with this id does not exist"})
    if(user._id.equals(sendingTo._id)) return res.status(400).json({message: "Cannot send friend request to yourself"})
    
    const friendRequest = {
      from: user._id,
      state: "pending",
      to: sendingTo._id
    }
    
    const alreadySent = user.friendRequests.some(
      request => request.from.equals(friendRequest.from) && request.to.equals(friendRequest.to) && request.state === "pending"
    )
    
    if(alreadySent) return res.status(400).json({message: "Friend request already sent"})
    
    user.friendRequests.push(friendRequest)
    sendingTo.friendRequests.push(friendRequest)
    
    await Promise.all([user.save(), sendingTo.save()])
    
    res.status(200).json({message: "friend request sent"})
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

const fetchFriends = async (req , res) =>{
  try{
    const user = req.user
    
    await user.populate('friends' , 'username _id profilePicture')
    
    const friendArr = user.friends.map(friend => ({id: friend._id , username: friend.username , profilePicture: friend.profilePicture}))
    
    res.status(200).json({friends: friendArr})
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

const fetchFriendRequests = async (req , res) =>{
  try{
    const user = req.user
    
    await user.populate('friendRequests.from' , 'username _id')
    await user.populate('friendRequests.to' , 'username _id')
    
    const requests = user.friendRequests.filter(
      request => request.to.equals(user._id) && request.state === 'pending'
    )
    
    res.status(200).json({requests: requests})
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

const acceptFriendRequest = async (req , res) =>{
  try{
    const {fromUserId} = req.body
    console.log(fromUserId , "fromuseridddd")
    const fromUser = await User.findById(fromUserId)
    
    const user = req.user

    if(!fromUser) return res.status(404).json({message: "User not found"})
    
    const userRequestIndex = user.friendRequests.findIndex(
      request => request.from.equals(fromUser._id) && request.to.equals(user._id) && request.state === 'pending'
    )
    
    const fromUserRequestIndex = fromUser.friendRequests.findIndex(
      request => request.from.equals(fromUser._id) && request.to.equals(user._id) && request.state === 'pending'
    )
    
    if(userRequestIndex === -1 || fromUserRequestIndex === -1) return res.status(404).json({message: "Friend request not found"}) // in case if request index doesnt exist
    
    const alreadyFriends = user.friends.some(friend => friend.equals(fromUser._id)) || fromUser.friends.some(friend => friend.equals(user._id))
    
    if(alreadyFriends) return res.status(400).json({message: "You are already friends"})
    
    user.friends.push(fromUser._id)
    fromUser.friends.push(user._id)
    
    user.friendRequests.splice(userRequestIndex , 1)
    fromUser.friendRequests.splice(fromUserRequestIndex , 1)
    
    await Promise.all([user.save(), fromUser.save()])
    
    res.status(200).json({message: "Friend request accepted, go to friends tab to view your new friend"})
  }catch(err){
    res.status(500).json({ message: err.message})
  }
}

const rejectFriendRequest = async (req, res) => {
  try {
    const { fromUserId } = req.body
    const fromUser = await User.findById(fromUserId)
    
    const user = req.user

    if (!fromUser) return res.status(404).json({ message: "User not found" })
    
    const userRequestIndex = user.friendRequests.findIndex(
      request => request.from.equals(fromUser._id) && request.to.equals(user._id) && request.state === 'pending'
    )
    const fromUserRequestIndex = fromUser.friendRequests.findIndex(
      request => request.from.equals(user._id) && request.to.equals(fromUser._id) && request.state === 'pending'
    )
    
    if(userRequestIndex === -1 || fromUserRequestIndex === -1) return res.status(404).json({message: "Friend request not found"}) // in case if request index doesnt exist
    
    user.friendRequests.splice(userRequestIndex , 1)
    fromUser.friendRequests.splice(fromUserRequestIndex , 1)
    
    await Promise.all([user.save(), fromUser.save()])
    
    res.status(200).json({message: "Friend request rejected"})
  }catch(err){
    res.status(500).json({ message: err.message})
  }
}

const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body
    const user = req.user
    
    const friend = await User.findById(friendId)
    
    if (!friend) return res.status(404).json({ message: "Friend not found" })
    
    const userFriendIndex = user.friends.findIndex(friend => friend.equals(friendId))
    const friendUserIndex = friend.friends.findIndex(friend => friend.equals(user._id))
    
    if(userFriendIndex === -1 || friendUserIndex === -1) return res.status(404).json({message: "Friend not found"})
    
    user.friends.splice(userFriendIndex , 1)
    friend.friends.splice(friendUserIndex , 1)
    
    await Promise.all([user.save(), friend.save()])
    
    res.status(200).json({message: "Friend removed"})
  }catch(err){
    res.status(500).json({ message: err.message})
  }
}

module.exports = { sendFriendRequest, fetchFriends, fetchFriendRequests , acceptFriendRequest , rejectFriendRequest , removeFriend}