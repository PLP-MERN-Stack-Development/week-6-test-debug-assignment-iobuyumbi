const Message = require("../models/Message");

// Save a new message
exports.saveMessage = async (data) => {
  const message = new Message(data);
  return await message.save();
};

// Get all messages (for global chat)
exports.getAllMessages = async () => {
  return await Message.find({ isPrivate: false }).sort({ timestamp: 1 });
};

// Get private messages between two users
exports.getPrivateMessages = async (user1, user2) => {
  return await Message.find({
    isPrivate: true,
    $or: [
      { sender: user1, to: user2 },
      { sender: user2, to: user1 },
    ],
  }).sort({ timestamp: 1 });
};
