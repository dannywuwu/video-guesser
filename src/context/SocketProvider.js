import React, { useEffect, useState, useContext } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}
export function SocketProvider({ children }) {
    const [socket, setSocket] = useState()

    useEffect(() => {
        const newSocket = io("https://song-searcher-backend-thing.weelam.repl.co")
        newSocket.on('connect', () => {
            console.log(`you have connected with id: ${newSocket.id}`)
        })

        setSocket(newSocket)


        return () => {
            newSocket.close()
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}


