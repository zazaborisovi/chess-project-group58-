const roomRouter = require("express").Router();
const {createGameRoom, getGameRoom} = require("../controllers/game.room.controller");
const {protect} = require("../middleware/protect");

roomRouter.post("/create", createGameRoom);
roomRouter.get("/:gameId", getGameRoom);

module.exports = roomRouter