import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}
export function SocketProvider({ children }) {
  const [clientSocket, setClientSocket] = useState();

  // sets clientSocket after server ack
  useEffect(() => {
    const tempSocket = io("http://localhost:5000");
    tempSocket.on(
      "connect",
      () => {
        console.log("Connect", tempSocket.id);
        setClientSocket(tempSocket);
      },
      []
    );

    return () => {
      tempSocket.disconnect();
      tempSocket.off();
    };
  }, []);

  // debug client socket
  // useEffect(() => {
  //   console.log("client socket", clientSocket);
  // }, [clientSocket]);

  return (
    <SocketContext.Provider value={clientSocket}>
      {children}
    </SocketContext.Provider>
  );
}
