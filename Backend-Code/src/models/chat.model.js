const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    sender: {
      type: String,
      enum: ["user", "bot"],
      required: true
    }
  },
  { timestamps: true }
);

// optimize query
chatSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model("Chat", chatSchema);