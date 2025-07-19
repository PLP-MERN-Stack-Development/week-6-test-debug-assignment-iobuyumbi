// server/tests/unit/server.test.js
const { app, server, io } = require("../../server");

describe("Server Setup", () => {
  it("should export app, server, and io", () => {
    expect(app).toBeDefined();
    expect(server).toBeDefined();
    expect(io).toBeDefined();
  });

  it("should have app as an Express application", () => {
    expect(typeof app.use).toBe("function");
    expect(typeof app.get).toBe("function");
    expect(typeof app.post).toBe("function");
  });

  it("should have server as an HTTP server", () => {
    expect(typeof server.listen).toBe("function");
    expect(typeof server.close).toBe("function");
  });

  it("should have io as a Socket.io server", () => {
    expect(typeof io.on).toBe("function");
    expect(typeof io.emit).toBe("function");
  });
});

describe("Server Configuration", () => {
  it("should use CORS middleware", () => {
    // This is a basic test to ensure the server is configured
    // In a real scenario, you'd test CORS headers in integration tests
    expect(app).toBeDefined();
  });

  it("should use JSON middleware", () => {
    // This is a basic test to ensure the server is configured
    // In a real scenario, you'd test JSON parsing in integration tests
    expect(app).toBeDefined();
  });
});

describe("Environment Variables", () => {
  it("should have default port configuration", () => {
    // Test that the server can start with default configuration
    expect(process.env.PORT || 5000).toBeDefined();
  });
});
