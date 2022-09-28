const express = require('express');

const { 
    accessChat,
    getChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
} = require('../controllers/chatController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// ACCESS a chat
router.post('/', requireAuth, accessChat);

// GET all the chats
router.get('/', requireAuth, getChats);

// CREATE a new group
router.post('/group', requireAuth, createGroupChat);

// RENAME a group
router.patch('/rename', requireAuth, renameGroup);

// ADD someone to the group
router.patch('/groupadd', requireAuth, addToGroup);

// REMOVE someobe from a group
router.patch('/groupremove', requireAuth, removeFromGroup);

module.exports = router;

