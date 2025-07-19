const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
  to: { type: String }, // for private messages
  room: { type: String, default: "general" }, // for chat rooms
});

module.exports = mongoose.model("Message", MessageSchema);
