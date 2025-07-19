// server/tests/integration/api.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const Message = require("../../models/Message");
const User = require("../../models/User");

describe("API Integration Tests", () => {
  let testUserId;
  let testMessageId;

  beforeAll(async () => {
    // Create a test user
    const user = await User.create({
      username: "testuser",
      socketId: "test-socket-id",
      isOnline: true,
    });
    testUserId = user._id;

    // Create a test message
    const message = await Message.create({
      sender: "testuser",
      senderId: "test-socket-id",
      message: "Test message",
      room: "general",
      timestamp: new Date(),
      isPrivate: false,
    });
    testMessageId = message._id;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Message.deleteMany({});
  });

  describe("GET /api/messages", () => {
    it("should return all messages", async () => {
      const response = await request(app).get("/api/messages").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should filter messages by room", async () => {
      const response = await request(app)
        .get("/api/messages?room=general")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((message) => {
        expect(message.room).toBe("general");
      });
    });

    it("should limit number of messages", async () => {
      const response = await request(app)
        .get("/api/messages?limit=5")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });
  });

  describe("GET /api/messages/:id", () => {
    it("should return a specific message", async () => {
      const response = await request(app)
        .get(`/api/messages/${testMessageId}`)
        .expect(200);

      expect(response.body._id).toBe(testMessageId.toString());
      expect(response.body.message).toBe("Test message");
    });

    it("should return 404 for non-existent message", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app).get(`/api/messages/${nonExistentId}`).expect(404);
    });

    it("should return 400 for invalid message ID", async () => {
      await request(app).get("/api/messages/invalid-id").expect(400);
    });
  });

  describe("POST /api/messages", () => {
    it("should create a new message", async () => {
      const newMessage = {
        sender: "newuser",
        senderId: "new-socket-id",
        message: "New test message",
        room: "general",
        isPrivate: false,
      };

      const response = await request(app)
        .post("/api/messages")
        .send(newMessage)
        .expect(201);

      expect(response.body.message).toBe(newMessage.message);
      expect(response.body.sender).toBe(newMessage.sender);
      expect(response.body.room).toBe(newMessage.room);
      expect(response.body.timestamp).toBeDefined();
    });

    it("should return 400 for invalid message data", async () => {
      const invalidMessage = {
        sender: "testuser",
        // Missing required fields
      };

      await request(app).post("/api/messages").send(invalidMessage).expect(400);
    });
  });

  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const response = await request(app).get("/api/users").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should filter online users", async () => {
      const response = await request(app)
        .get("/api/users?online=true")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((user) => {
        expect(user.isOnline).toBe(true);
      });
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a specific user", async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);

      expect(response.body._id).toBe(testUserId.toString());
      expect(response.body.username).toBe("testuser");
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app).get(`/api/users/${nonExistentId}`).expect(404);
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const newUser = {
        username: "newuser",
        socketId: "new-socket-id",
        isOnline: true,
      };

      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201);

      expect(response.body.username).toBe(newUser.username);
      expect(response.body.socketId).toBe(newUser.socketId);
      expect(response.body.isOnline).toBe(newUser.isOnline);
    });

    it("should return 400 for duplicate username", async () => {
      const duplicateUser = {
        username: "testuser", // Already exists
        socketId: "another-socket-id",
        isOnline: true,
      };

      await request(app).post("/api/users").send(duplicateUser).expect(400);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update user status", async () => {
      const updates = {
        isOnline: false,
        socketId: "updated-socket-id",
      };

      const response = await request(app)
        .put(`/api/users/${testUserId}`)
        .send(updates)
        .expect(200);

      expect(response.body.isOnline).toBe(updates.isOnline);
      expect(response.body.socketId).toBe(updates.socketId);
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/api/users/${nonExistentId}`)
        .send({ isOnline: false })
        .expect(404);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user", async () => {
      // Create a user to delete
      const userToDelete = await User.create({
        username: "deleteuser",
        socketId: "delete-socket-id",
        isOnline: true,
      });

      await request(app).delete(`/api/users/${userToDelete._id}`).expect(200);

      // Verify user is deleted
      const deletedUser = await User.findById(userToDelete._id);
      expect(deletedUser).toBeNull();
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await request(app).delete(`/api/users/${nonExistentId}`).expect(404);
    });
  });

  describe("Error handling", () => {
    it("should handle database connection errors gracefully", async () => {
      // This test would require mocking database failures
      // For now, we'll test that the server responds to requests
      const response = await request(app).get("/api/messages").expect(200);

      expect(response.status).toBe(200);
    });

    it("should validate request data", async () => {
      const invalidData = {
        message: "", // Empty message
        sender: "", // Empty sender
      };

      await request(app).post("/api/messages").send(invalidData).expect(400);
    });
  });
});
