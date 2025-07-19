const messageController = require("../controllers/messageController");
const userController = require("../controllers/userController");

// In-memory typing users (can be improved later)
const typingUsers = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining
    socket.on("user_join", async (username) => {
      await userController.addOrUpdateUser({ username, socketId: socket.id });
      const users = await userController.getOnlineUsers();
      io.emit("user_list", users);
      io.emit("user_joined", { username, id: socket.id });
      console.log(`${username} joined the chat`);
    });

    // Handle joining a room
    socket.on("join_room", (room) => {
      socket.join(room);
      socket.currentRoom = room;
      socket.emit("joined_room", room);
    });

    // Handle leaving a room
    socket.on("leave_room", (room) => {
      socket.leave(room);
      if (socket.currentRoom === room) {
        delete socket.currentRoom;
      }
      socket.emit("left_room", room);
    });

    // Handle chat messages (now with room support)
    socket.on("send_message", async (messageData) => {
      const user = await userController.getUserBySocketId(socket.id);
      const room = messageData.room || socket.currentRoom || "general";
      const message = {
        ...messageData,
        sender: user?.username || "Anonymous",
        senderId: socket.id,
        timestamp: new Date().toISOString(),
        isPrivate: false,
        room,
      };
      await messageController.saveMessage(message);
      io.to(room).emit("receive_message", message);
    });

    // Handle typing indicator (in-memory)
    socket.on("typing", (isTyping) => {
      if (isTyping) {
        typingUsers[socket.id] = socket.id;
      } else {
        delete typingUsers[socket.id];
      }
      io.emit("typing_users", Object.values(typingUsers));
    });

    // Handle private messages
    socket.on("private_message", async ({ to, message }) => {
      const user = await userController.getUserBySocketId(socket.id);
      const messageData = {
        sender: user?.username || "Anonymous",
        senderId: socket.id,
        message,
        timestamp: new Date().toISOString(),
        isPrivate: true,
        to,
      };
      await messageController.saveMessage(messageData);
      socket.to(to).emit("private_message", messageData);
      socket.emit("private_message", messageData);
    });

    // Handle disconnection
    socket.on("disconnect", async () => {
      const user = await userController.getUserBySocketId(socket.id);
      if (user) {
        await userController.removeUser(socket.id);
        io.emit("user_left", { username: user.username, id: socket.id });
        console.log(`${user.username} left the chat`);
      }
      const users = await userController.getOnlineUsers();
      io.emit("user_list", users);
      io.emit("typing_users", Object.values(typingUsers));
    });
  });
};
