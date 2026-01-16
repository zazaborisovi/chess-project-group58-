const roomRouter = require("express").Router();
const {createPrivateRoom, getGameRoom, createPublicRoom} = require("../controllers/game.room.controller");
const {protect} = require("../middleware/protect");

roomRouter.post("/private", protect , createPrivateRoom);
roomRouter.post("/public", protect , createPublicRoom)
roomRouter.get("/:gameId", protect , getGameRoom);

module.exports = roomRouter