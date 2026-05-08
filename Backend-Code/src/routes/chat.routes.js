const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

// Save chat
router.post("/", chatController.createChat);

// Get chat history
router.get("/:userId", chatController.getChats);

module.exports = router;