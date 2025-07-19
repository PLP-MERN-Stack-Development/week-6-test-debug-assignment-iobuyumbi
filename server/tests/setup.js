// server/tests/setup.js
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// TIP: If you have issues with downloads, clear the cache at %USERPROFILE%\.cache\mongodb-binaries
// or run: Remove-Item "$env:USERPROFILE\.cache\mongodb-binaries" -Recurse -Force

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: { version: "4.0.25" },
  }); // Use smaller, stable version
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await new Promise((resolve) => {
    mongoose.connection.once("open", resolve);
  });
}, 60000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 60000);

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

jest.setTimeout(60000); // 60s for all tests
