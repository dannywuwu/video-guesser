import React, { useEffect, useState, useContext } from "react";
import userFactory from "../hooks/userFactory";

const UserContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  let defaultUser = userFactory(
    0,
    0,
    "default-user",
    "default-room",
    "",
    "",
    false
  );
  const [user, setUser] = useState(defaultUser);
  const [allUsers, setAllUsers] = useState([user]);

  let value = { user, setUser, allUsers, setAllUsers };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
