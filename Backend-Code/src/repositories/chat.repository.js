const Chat = require("../models/chat.model");

class ChatRepository {
  async create(data) {
    return Chat.create(data);
  }

  async findByUser(userId, limit = 50) {
    return Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

module.exports = new ChatRepository();