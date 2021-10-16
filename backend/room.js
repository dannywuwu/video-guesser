
const { getUser }  = require("./users.js")

const addUserToRoom = (rooms, room, user) => {
  if (rooms[room]) {
    rooms[room].push(user)
  } else {
    rooms[room] = [user]
  }
}

// gets user inside a particular room
const getUsersInRoom = (rooms, room) => {
  // return users.filter(user => user.room === room)
  return rooms[room]
}

// gets the current turn of that room
const getRoomTurn = (room) => {
    return users[room]; // list of users
}

// isekai yourself from the room
const leaveRoom = (user, rooms, id) => {
  if (rooms[user.room]) {
    rooms[user.room] =  rooms[user.room].filter(user => user.id !== id)
  }
  user.room = ""
  user.name = ""

  
}

module.exports = {addUserToRoom, leaveRoom, getRoomTurn, getUsersInRoom}