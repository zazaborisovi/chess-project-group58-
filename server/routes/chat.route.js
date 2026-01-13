const chatRouter = require('express').Router();
const { protect } = require('../middleware/protect');

const { createChat, getChat, getUserChats } = require('../controllers/chat.controller');

chatRouter.post('/create-chat', protect , createChat)
chatRouter.get('/:chatId', protect , getChat)
chatRouter.get('/', protect , getUserChats)

module.exports = chatRouter;