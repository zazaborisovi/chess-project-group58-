const chatRouter = require('express').Router();

const { createChat, getChat, getUserChats } = require('../controllers/chat.controller');

chatRouter.post('/create-chat', createChat)
chatRouter.get('/:chatId', getChat)
chatRouter.get('/', getUserChats)

module.exports = chatRouter;