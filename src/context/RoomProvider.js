import React, { useEffect, useState, useContext } from "react";
import roomFactory from "../hooks/roomFactory";

const RoomContext = React.createContext();

export function useRoom() {
  return useContext(RoomContext);
}


export const defaultChooserModel = {
    id: "",
    position: 0,
    name: "defaultName",
    room: "",
    points: 0,
    guess: "__________",
  };
  

export function RoomProvider({ children }) {
  const defaultRoom = roomFactory(
    "default-rName", // client socket id
    {}, // users
    1, // turn
    "search",// phase
    defaultChooserModel
  );

  const [room, setRoom] = useState(defaultRoom);
  const value = { room, setRoom };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
