# 🧪 MERN Chat Application with Comprehensive Testing

A real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.io, featuring comprehensive testing strategies including unit tests, integration tests, and debugging techniques.

## 🚀 Features

- **Real-time messaging** with Socket.io
- **Room-based chat** system
- **User presence** indicators
- **Typing indicators**
- **Private messaging**
- **Responsive UI** with Tailwind CSS
- **Comprehensive testing** suite

## 📂 Project Structure

```
mern-chat-testing/
├── client/                 # React front-end
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── socket/         # Socket.io client logic
│   │   ├── tests/          # Client-side tests
│   │   │   ├── unit/       # Unit tests
│   │   │   └── integration/ # Integration tests
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── socket/             # Socket.io event handlers
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── tests/              # Server-side tests
│   │   ├── unit/           # Unit tests
│   │   └── integration/    # Integration tests
│   └── package.json        # Server dependencies
├── jest.config.js          # Jest configuration
└── package.json            # Root dependencies
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- MongoDB (local installation or Atlas account)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd mern-chat-testing
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create `.env` files in both `client/` and `server/` directories:

   **server/.env:**

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chat-app
   CLIENT_URL=http://localhost:5173
   ```

   **client/.env:**

   ```env
   VITE_SERVER_URL=http://localhost:5000
   ```

4. **Start the development servers**

   ```bash
   # Start both client and server
   pnpm dev

   # Or start them separately
   pnpm --filter server dev
   pnpm --filter client dev
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run client tests only
pnpm test:client

# Run server tests only
pnpm test:server

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Test Coverage

The project aims for at least **70% code coverage** across:

- **Statements**: 70%
- **Branches**: 60%
- **Functions**: 70%
- **Lines**: 70%

### Test Types

#### 1. Unit Tests

- **Client**: React components, hooks, utilities
- **Server**: Controllers, middleware, utility functions

#### 2. Integration Tests

- **API endpoints** with database operations
- **Socket.io events** and real-time functionality
- **Component integration** with API calls

#### 3. End-to-End Tests (Future)

- **User flows** (registration, messaging, room management)
- **Real-time interactions**
- **Error handling scenarios**

## 🔧 Testing Tools

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React
- **Supertest**: HTTP assertions for API testing
- **Socket.io-client**: Socket testing
- **MongoDB Memory Server**: In-memory MongoDB for testing

## 🐛 Debugging Techniques

### Client-side Debugging

- **React DevTools** for component inspection
- **Browser DevTools** for network and console debugging
- **Error boundaries** for graceful error handling
- **Console logging** for state tracking

### Server-side Debugging

- **Express error handling** middleware
- **MongoDB query logging**
- **Socket.io event logging**
- **Performance monitoring**

## 📝 API Documentation

### Socket Events

#### Client to Server

- `user_join`: Join chat with username
- `join_room`: Join a specific room
- `leave_room`: Leave a room
- `send_message`: Send a message
- `typing`: Indicate typing status
- `private_message`: Send private message

#### Server to Client

- `user_joined`: User joined notification
- `user_left`: User left notification
- `joined_room`: Room join confirmation
- `left_room`: Room leave confirmation
- `receive_message`: New message received
- `typing_users`: List of typing users
- `user_list`: Updated user list

### REST API Endpoints

#### Messages

- `GET /api/messages` - Get all messages
- `GET /api/messages/:id` - Get specific message
- `POST /api/messages` - Create new message

#### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🚀 Deployment

### Production Build

```bash
# Build client
pnpm --filter client build

# Start production server
pnpm --filter server start
```

### Environment Variables

Set appropriate environment variables for production:

- `MONGODB_URI`: Production MongoDB connection
- `CLIENT_URL`: Production client URL
- `PORT`: Production port

## 📊 Performance Monitoring

- **Socket connection monitoring**
- **Database query optimization**
- **Memory usage tracking**
- **Response time monitoring**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **Socket connection fails**

   - Check CORS configuration
   - Verify server URL in client
   - Ensure server is running

2. **Database connection issues**

   - Verify MongoDB is running
   - Check connection string
   - Ensure network connectivity

3. **Test failures**
   - Clear Jest cache: `pnpm jest --clearCache`
   - Check test database setup
   - Verify all dependencies are installed

### Getting Help

- Check the test logs for detailed error messages
- Review the debugging section above
- Ensure all environment variables are set correctly
