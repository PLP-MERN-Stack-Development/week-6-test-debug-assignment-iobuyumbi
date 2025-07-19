import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export default function UserList({ users, currentUser, onSelectUser }) {
  return (
    <Card className="p-4 mb-2">
      <div className="font-semibold mb-2">Online Users:</div>
      <div className="flex flex-wrap gap-2">
        {users.map(user => (
          <Button
            key={user.socketId}
            variant={user.username === currentUser ? 'secondary' : 'outline'}
            onClick={() => onSelectUser(user)}
            disabled={user.username === currentUser}
            className="text-sm px-2 py-1"
          >
            {user.username}
          </Button>
        ))}
      </div>
    </Card>
  );
} 