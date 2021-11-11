import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}
export function SocketProvider({ children }) {
  const [clientSocket, setSocket] = useState();

  useEffect(() => {
    const tempSocket = io("localhost:5000");
    tempSocket.on(
      "connect",
      () => {
        console.log(tempSocket.id);
        setSocket(tempSocket);
      },
      []
    );

    return () => {
      tempSocket.disconnect();
      tempSocket.off();
    };
  }, []);
  return (
    <SocketContext.Provider value={clientSocket}>
      {children}
    </SocketContext.Provider>
  );
}
