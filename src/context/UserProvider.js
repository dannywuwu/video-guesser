import React, { useEffect, useState, useContext } from "react";
import userFactory from "../hooks/userFactory";

const UserContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const defaultUser = userFactory(
    "default-id", // client socket id
    undefined, // position
    undefined, // name
    undefined, // room
    0, // points
    undefined // guess
  );
  const [user, setUser] = useState(defaultUser);
  const [allUsers, setAllUsers] = useState([user]);

  const value = { user, setUser, allUsers, setAllUsers };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
