// jest.config.js - Root Jest configuration file

module.exports = {
  // Base configuration for all tests
  projects: [
    // Server-side tests configuration
    {
      displayName: "server",
      testEnvironment: "node",
      testMatch: ["<rootDir>/server/tests/**/*.test.js"],
      moduleFileExtensions: ["js", "json", "node"],
      setupFilesAfterEnv: ["<rootDir>/server/tests/setup.js"],
      coverageDirectory: "<rootDir>/coverage/server",
      collectCoverageFrom: [
        "server/**/*.js",
        "!server/node_modules/**",
        "!server/tests/**",
      ],
      testTimeout: 60000,
    },

    // Client-side tests configuration
    {
      displayName: "client",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/client/src/**/*.test.{js,jsx}"],
      moduleFileExtensions: ["js", "jsx", "json"],
      moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|webp|svg)$":
          "<rootDir>/client/src/tests/__mocks__/fileMock.js",
        "^@/(.*)$": "<rootDir>/client/src/$1",
      },
      setupFilesAfterEnv: ["<rootDir>/client/src/tests/setup.js"],
      transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
      },
      coverageDirectory: "<rootDir>/coverage/client",
      collectCoverageFrom: [
        "client/src/**/*.{js,jsx}",
        "!client/src/main.jsx",
        "!client/src/index.css",
        "!client/src/tests/**",
        "!**/node_modules/**",
      ],
    },
  ],

  // Global configuration
  verbose: true,
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "clover", "html"],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  testTimeout: 10000,
};
