const express = require('express');
const { askChatbot } = require('../controllers/chatbot.controller');
const { optionalAuthMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/ask', optionalAuthMiddleware, askChatbot);

module.exports = router;
