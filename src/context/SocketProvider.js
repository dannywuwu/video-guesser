import React, { useEffect, useState, useContext } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState()

  useEffect(() => {
    const temp_socket = io("https://song-searcher-backend-thing.weelam.repl.co")
    temp_socket.on('connect', () => {
      console.log(temp_socket.id) 
    }, [])
    setSocket(temp_socket)
    // temp_socket.emit("join-room", name, room, (user) => {
    //   console.log(user)
    // })


    return () => {
      socket.disconnect()
      socket.off()
    }
  }, [])
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}


