const chatRepository = require("../repositories/chat.repository");

class ChatService {
  async saveMessage({ userId, message, sender }) {
    if (!userId || !message || !sender) {
      throw new Error("Invalid chat data");
    }

    return chatRepository.create({
      userId,
      message,
      sender
    });
  }

  async getChatHistory(userId) {
    const chats = await chatRepository.findByUser(userId);
    return chats.reverse(); // oldest → newest
  }
}

module.exports = new ChatService();