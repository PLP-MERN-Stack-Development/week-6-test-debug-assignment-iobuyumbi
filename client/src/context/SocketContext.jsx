import React, { createContext, useContext } from "react";
import { useSocket } from "../socket/socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketState = useSocket();
  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
