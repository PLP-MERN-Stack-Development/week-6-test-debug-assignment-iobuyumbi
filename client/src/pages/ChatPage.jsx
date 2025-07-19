import React, { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import UserList from "../components/UserList";
import RoomList from "../components/RoomList";

const DEFAULT_ROOMS = ["general", "random", "help"];

export default function ChatPage() {
  const {
    connect,
    disconnect,
    isConnected,
    messages,
    users,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    socket,
  } = useSocketContext();
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [input, setInput] = useState("");
  const [privateUser, setPrivateUser] = useState(null);
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [currentRoom, setCurrentRoom] = useState("general");

  // Join chat
  const handleJoin = () => {
    if (username.trim()) {
      connect(username);
      setJoined(true);
      joinRoom("general");
      window.currentUsername = username;
    }
  };

  // Join a room
  const joinRoom = (room) => {
    if (socket) {
      socket.emit("join_room", room);
      setCurrentRoom(room);
      setPrivateUser(null);
    }
  };

  // Create a new room
  const handleCreateRoom = (room) => {
    if (!rooms.includes(room)) {
      setRooms([...rooms, room]);
      joinRoom(room);
    } else {
      joinRoom(room);
    }
  };

  // Send message
  const handleSend = () => {
    if (input.trim()) {
      if (privateUser) {
        sendPrivateMessage(privateUser.socketId, input);
      } else {
        sendMessage({ message: input, room: currentRoom });
      }
      setInput("");
      setTyping(false);
    }
  };

  // Typing indicator
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const handleSelectUser = (user) => {
    setPrivateUser(user);
  };

  const handleBackToPublic = () => {
    setPrivateUser(null);
  };

  const handleSelectRoom = (room) => {
    joinRoom(room);
  };

  // Filter messages for private chat or current room
  const filteredMessages = privateUser
    ? messages.filter(
        (msg) =>
          msg.isPrivate &&
          ((msg.sender === username && msg.to === privateUser.socketId) ||
            (msg.senderId === privateUser.socketId && msg.to === username))
      )
    : messages.filter((msg) => !msg.isPrivate && msg.room === currentRoom);

  if (!joined) {
    return (
      <Card className="p-8 flex flex-col gap-4 items-center">
        <h2 className="text-xl font-semibold">Enter your username</h2>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full"
        />
        <Button onClick={handleJoin} className="w-full">
          Join Chat
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <RoomList
        rooms={rooms}
        currentRoom={currentRoom}
        onSelectRoom={handleSelectRoom}
        onCreateRoom={handleCreateRoom}
      />
      <UserList
        users={users}
        currentUser={username}
        onSelectUser={handleSelectUser}
      />
      {privateUser ? (
        <Card className="p-2 flex items-center gap-2 bg-yellow-50 border-yellow-300">
          <span>
            Private chat with <b>{privateUser.username}</b>
          </span>
          <Button size="sm" variant="outline" onClick={handleBackToPublic}>
            Back to Public Chat
          </Button>
        </Card>
      ) : (
        <Card className="p-2 flex items-center gap-2 bg-green-50 border-green-300">
          <span>
            Room: <b>{currentRoom}</b>
          </span>
        </Card>
      )}
      <Card className="p-4 flex-1 min-h-[300px] max-h-[400px] overflow-y-auto mb-2">
        <div className="space-y-2">
          {filteredMessages.map((msg, idx) => (
            <div key={idx} className="text-sm">
              <span className="font-bold mr-2">
                {msg.sender || (msg.system ? "System" : "Anonymous")}:
              </span>
              <span>{msg.message}</span>
              <span className="ml-2 text-gray-400 text-xs">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
      <div className="flex gap-2">
        <Input
          placeholder={
            privateUser
              ? `Message @${privateUser.username}`
              : `Message #${currentRoom}`
          }
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} disabled={!input.trim()}>
          {privateUser ? "Send Private" : "Send"}
        </Button>
      </div>
    </div>
  );
}
