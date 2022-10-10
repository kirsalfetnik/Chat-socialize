const express = require('express');

const { 
    sendMessage,
    allMessages
} = require('../controllers/messageController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// SEND a message
router.post('/', requireAuth, sendMessage);

// SHOW all messages
router.get('/:chatId', requireAuth, allMessages);

module.exports = router;