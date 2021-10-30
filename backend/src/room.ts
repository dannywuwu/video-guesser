// room room!
interface Room {
  users: User[];
  turn: number;
}

// maps room id to Room object
type Rooms = Record<string, Room>;

const addUserToRoom = (rooms: Rooms, room: string, user: User) => {
  // if room exists, add user
  if (rooms[room]) {
    rooms[room].users.push(user);
  } else {
    // new room containing only user
    rooms[room].users = [user];
  }
};

// gets user inside a particular room
const getUsersInRoom = (rooms: Rooms, room: string) => {
  // return users.filter(user => user.room === room)
  return rooms[room].users;
};

// gets the current turn of that room
const getRoomTurn = (rooms: Rooms, room: string) => {
  return rooms[room];
};

// isekai yourself from the room
const leaveRoom = (user: User, rooms: Rooms, id: number) => {
  // assert room is defined
  if (user.room === undefined) {
    throw "How are you leaving a room when you're not in a room";
  }
  // filtere yourself from the room
  if (rooms[user.room]) {
    rooms[user.room].users = rooms[user.room].users.filter(
      (user: User) => user.id !== id
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
