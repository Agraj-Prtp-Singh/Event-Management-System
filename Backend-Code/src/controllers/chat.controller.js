const chatService = require("../services/chat.service");

class ChatController {
  async createChat(req, res, next) {
    try {
      const { userId, message, sender } = req.body;

      const chat = await chatService.saveMessage({
        userId,
        message,
        sender
      });

      res.status(201).json({
        success: true,
        data: chat
      });
    } catch (err) {
      next(err);
    }
  }

  async getChats(req, res, next) {
    try {
      const { userId } = req.params;

      const chats = await chatService.getChatHistory(userId);

      res.json({
        success: true,
        data: chats
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ChatController();