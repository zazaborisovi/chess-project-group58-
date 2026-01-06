const friendRouter = require("express").Router()
const protect = require("../middleware/protect")
const { sendFriendRequest, fetchFriends, fetchFriendRequests, acceptFriendRequest } = require("../controllers/friends.controller")

friendRouter.post("/send-friend-request", protect , sendFriendRequest)
friendRouter.get("/friends", protect , fetchFriends)

friendRouter.get("/requests" , protect , fetchFriendRequests)
friendRouter.post("/accept-friend-request" , protect , acceptFriendRequest)


module.exports = friendRouter