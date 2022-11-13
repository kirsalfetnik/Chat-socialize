const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({error: "Error occured"});
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name picture");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name picture email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        });

        res.json(message);
    } catch (error) {
        res.status(400).json({error: "Error occured"});
    }
}

const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name picture email")
        .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400).json({error: "Error occured"});
    }
}

module.exports = { sendMessage, allMessages };