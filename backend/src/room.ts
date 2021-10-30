// room room!
interface Room {
  users: User[];
  turn: number;
}

const addUserToRoom = (
  rooms: Record<string, Room>,
  room: string,
  user: User
) => {
  // if room exists, add user
  if (rooms[room]) {
    rooms[room].users.push(user);
  } else {
    // new room containing only user
    rooms[room].users = [user];
  }
};

// gets user inside a particular room
const getUsersInRoom = (rooms: Record<string, Room>, room: string) => {
  // return users.filter(user => user.room === room)
  return rooms[room].users;
};

// gets the current turn of that room
const getRoomTurn = (rooms: Record<string, Room>, room: string) => {
  return rooms[room];
};

// isekai yourself from the room
const leaveRoom = (user: User, rooms: Record<string, Room>, id: number) => {
  // assert room is defined
  if (user.room === undefined) {
    throw "How are you leaving a room when you're not in a room";
  }
  // filtere yourself from the room
  if (rooms[user.room]) {
    rooms[user.room].users = rooms[user.room].users.filter(
      (user) => user.id !== id
    );
  }
  // you are now nameless and without room/board
  user.room = undefined;
  user.name = undefined;
};

module.exports = {
  addUserToRoom,
  leaveRoom,
  getRoomTurn,
  getUsersInRoom,
};
