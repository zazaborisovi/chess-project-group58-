const Chat = require('../models/chat.model');

// chat controller for creating getting chats for friends

const createChat = async (req , res) =>{
  try{
    const userId = req.user._id
    const { friendId } = req.body
    
    if(userId.equals(friendId)) res.status(400).json({error: 'Cannot create chat with yourself'});
    
    const existingChat = await Chat.findOne({ users: { $all: [userId, friendId] } })
    
    if (existingChat) res.status(409).json({ error: 'Chat already exists' });
    
    const chat = await Chat.create({ users: [userId, friendId] })
    
    res.status(201).json({chat});
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

const getChat = async (req , res) =>{
  try{
    const { chatId } = req.params
    
    const chat = await Chat.findById(chatId)
    
    if(!chat) res.status(404).json({error: 'Chat not found'});
    
    res.status(200).json(chat);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id
    const chats = await Chat.find({ users: userId })
      .populate('users' , 'username')
      .sort({updatedAt: -1})

    res.status(200).json(chats);
  }catch(err){
    res.status(500).json({error: err.message});
  }
}

module.exports = {createChat , getChat , getUserChats}