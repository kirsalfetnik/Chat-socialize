const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// ACCESS/CREATE a chat
const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        res.status(400).json({error: error.message});
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq:req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    }).populate("users", "-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name, picture, email'
    });
    if (isChat.length > 0) {
        res.status(200).json(isChat[0]);
    } else {
        var chatData = {
            chatName: req.body.name,
            isGroupChat: false,
            users: [req.user._id, userId]
        }
    }

    try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password");

        res.status(200).json(fullChat);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// GET all chats
const getChats = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: {$eq: req.user._id} } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name picture email"
            });

        res.status(200).json(results);
        })
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// DELETE a chat
const deleteChat = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No such chat"});
    }

    const chat = await Chat.findOneAndDelete({_id: id});

    if (!chat) {
        return res.status(400).json({error: "No such chat"});
    }

    res.status(200).json(chat);
}

// POST a new group chat
const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ error: "Fill in all the fields" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).json({ error: "More than 2 users are required to form a group chat" });
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        }, {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(400).json({ error: "Chat not found" })
    } else {
        res.json(updatedChat);
    }
}

const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId, 
        {
        $push: { users: userId }
        }, {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404).json({ error: "Chat not found"} );
    } else {
        res.json(added);
    }
}

const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId, 
        {
        $pull: { users: userId }
        }, {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404).json({ error: "Chat not found"} );
    } else {
        res.json(removed);
    }
}

module.exports = { accessChat, getChats, deleteChat, createGroupChat, renameGroup, addToGroup, removeFromGroup };