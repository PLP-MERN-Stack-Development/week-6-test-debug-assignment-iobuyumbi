import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function RoomList({
  rooms,
  currentRoom,
  onSelectRoom,
  onCreateRoom,
}) {
  const [newRoom, setNewRoom] = useState("");

  const handleCreate = () => {
    if (newRoom.trim()) {
      onCreateRoom(newRoom.trim());
      setNewRoom("");
    }
  };

  return (
    <Card className="p-4 mb-2">
      <div className="font-semibold mb-2">Chat Rooms:</div>
      <div className="flex flex-wrap gap-2 mb-2">
        {rooms.map((room) => (
          <Button
            key={room}
            variant={room === currentRoom ? "secondary" : "outline"}
            onClick={() => onSelectRoom(room)}
            className="text-sm px-2 py-1"
          >
            {room}
          </Button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Input
          placeholder="New room name"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          className="w-full"
        />
        <Button onClick={handleCreate} disabled={!newRoom.trim()}>
          Create
        </Button>
      </div>
    </Card>
  );
}
