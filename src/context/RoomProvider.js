import React, { useEffect, useState, useContext } from 'react'

const RoomContext = React.createContext()

export function useRoom() {
    return useContext(RoomContext)
}
export function RoomProvider({ children }) {
    const [room, setRoom] = useState("kkk")
    const [name, setName] = useState("weelam")

    let value = {
        'room': {room, setRoom},
        'name': {name, setName}
    }
    return (
        <RoomContext.Provider value={value}>
            {children}
        </RoomContext.Provider>
    )
}


