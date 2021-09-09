import React, { useEffect, useState, useContext } from 'react'
import userFactory from "../hooks/userFactory"


const UserContext = React.createContext()

export function useUser() {
  return useContext(UserContext)
}

export function UserProvider({ children }) {

  let defaultUser = userFactory(0, "default-user", "default-room", "", "", false)
  const [user, setUser] = useState(defaultUser)
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    setUsers([user.id])
  }, [])

  let value = { user, setUser, users, setUsers }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}


  