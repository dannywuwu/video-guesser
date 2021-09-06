import React, { useEffect, useState, useContext } from 'react'
import userFactory from "../hooks/userFactory"


const UserContext = React.createContext()

export function useUser() {
  return useContext(UserContext)
}

export function UserProvider({ children }) {

  let thing = userFactory(1, "william", "room1")
  const [user, setUser] = useState(thing)

  let value = { user, setUser }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}


  