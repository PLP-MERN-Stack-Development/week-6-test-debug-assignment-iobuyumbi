const User = require("../models/User");

// Add or update a user
exports.addOrUpdateUser = async ({ username, socketId }) => {
  return await User.findOneAndUpdate(
    { username },
    { username, socketId, online: true },
    { upsert: true, new: true }
  );
};

// Remove a user (set online to false)
exports.removeUser = async (socketId) => {
  return await User.findOneAndUpdate(
    { socketId },
    { online: false },
    { new: true }
  );
};

// Get all online users
exports.getOnlineUsers = async () => {
  return await User.find({ online: true });
};

// Get user by socketId
exports.getUserBySocketId = async (socketId) => {
  return await User.findOne({ socketId });
};
