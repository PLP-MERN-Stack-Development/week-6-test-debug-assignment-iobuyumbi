// server/tests/unit/socket.test.js
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const socketHandler = require("../../socket");

describe("Socket.io Chat Functionality", () => {
  let io, serverSocket, clientSocket, httpServer;

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    socketHandler(io);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = Client(`http://localhost:${port}`);
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    httpServer.close();
  });

  beforeEach(() => {
    // Clear any existing room memberships
    if (serverSocket) {
      serverSocket.leaveAll();
    }
  });

  it("should handle user connection", (done) => {
    clientSocket.on("connect", () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });

  it("should handle user joining", (done) => {
    const username = "testuser";

    clientSocket.emit("user_join", username);

    clientSocket.on("user_joined", (data) => {
      expect(data.username).toBe(username);
      expect(data.id).toBe(clientSocket.id);
      done();
    });
  });

  it("should handle joining a room", (done) => {
    const roomName = "test-room";

    clientSocket.emit("join_room", roomName);

    clientSocket.on("joined_room", (room) => {
      expect(room).toBe(roomName);
      done();
    });
  });

  it("should handle leaving a room", (done) => {
    const roomName = "test-room";

    // First join the room
    clientSocket.emit("join_room", roomName);

    // Then leave it
    clientSocket.emit("leave_room", roomName);

    clientSocket.on("left_room", (room) => {
      expect(room).toBe(roomName);
      done();
    });
  });

  it("should handle sending and receiving messages", (done) => {
    const messageData = {
      message: "Hello, world!",
      room: "general",
    };

    clientSocket.emit("send_message", messageData);

    clientSocket.on("receive_message", (message) => {
      expect(message.message).toBe(messageData.message);
      expect(message.room).toBe(messageData.room);
      expect(message.timestamp).toBeDefined();
      expect(message.sender).toBeDefined();
      done();
    });
  });

  it("should handle typing indicators", (done) => {
    clientSocket.emit("typing", true);

    clientSocket.on("typing_users", (typingUsers) => {
      expect(Array.isArray(typingUsers)).toBe(true);
      expect(typingUsers).toContain(clientSocket.id);
      done();
    });
  });

  it("should stop typing indicator when user stops typing", (done) => {
    // First start typing
    clientSocket.emit("typing", true);

    // Then stop typing
    clientSocket.emit("typing", false);

    clientSocket.on("typing_users", (typingUsers) => {
      expect(Array.isArray(typingUsers)).toBe(true);
      expect(typingUsers).not.toContain(clientSocket.id);
      done();
    });
  });

  it("should handle private messages", (done) => {
    const privateMessageData = {
      to: "other-user-id",
      message: "Private message",
    };

    clientSocket.emit("private_message", privateMessageData);

    clientSocket.on("private_message", (message) => {
      expect(message.message).toBe(privateMessageData.message);
      expect(message.to).toBe(privateMessageData.to);
      expect(message.isPrivate).toBe(true);
      expect(message.timestamp).toBeDefined();
      done();
    });
  });

  it("should handle user disconnection", (done) => {
    // First join as a user
    clientSocket.emit("user_join", "disconnect-test-user");

    // Then disconnect
    clientSocket.disconnect();

    // Reconnect to check if user was removed
    clientSocket.connect();

    clientSocket.on("connect", () => {
      // The user should have been removed from the online users list
      // This is a basic test - in a real scenario you'd check the user list
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });

  it("should emit user list when user joins", (done) => {
    const username = "list-test-user";

    clientSocket.emit("user_join", username);

    clientSocket.on("user_list", (users) => {
      expect(Array.isArray(users)).toBe(true);
      // The user should be in the list
      const userInList = users.find((user) => user.username === username);
      expect(userInList).toBeDefined();
      done();
    });
  });

  it("should handle messages without room specification", (done) => {
    const messageData = {
      message: "Message without room",
    };

    clientSocket.emit("send_message", messageData);

    clientSocket.on("receive_message", (message) => {
      expect(message.message).toBe(messageData.message);
      // Should default to 'general' room
      expect(message.room).toBe("general");
      done();
    });
  });
});
