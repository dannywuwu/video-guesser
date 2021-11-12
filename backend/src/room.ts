// room room!
type Room = {
  users: Users;
  turn: number;
  chooser?: User;
};

// maps room id to Room object
type Rooms = Record<string, Room>;

const addUserToRoom = (rooms: Rooms, room: string, user: User): void => {
  const uid = user.id;
  // if room exists, add user
  if (rooms[room]) {
    // if user already in room, remove current room
    if (user.room != undefined) {
      leaveRoom(user, rooms);
    }
    rooms[room] = {
      ...rooms[room],
      users: {
        [uid]: user,
      },
    };
  } else {
    // new room containing only user starting at turn 0
    rooms[room] = {
      users: {
        [uid]: user,
      },
      turn: 0,
      chooser: undefined,
    };
  }
  // mutate user
  user.room = room;
  user.position = Object.keys(getUsersInRoom(rooms, room)).length;
};

// gets users map inside a particular room
const getUsersInRoom = (rooms: Rooms, room: string): Users => {
  return rooms[room].users;
};

// gets the current turn of that room
const getRoomTurn = (rooms: Rooms, room: string): number => {
  return rooms[room].turn;
};

// isekai yourself from the room
const leaveRoom = (user: User, rooms: Rooms): void => {
  // assert room is defined
  if (user.room === undefined) {
    throw "How are you leaving a room when you're not in a room";
  }
  // delete yourself from the room
  delete rooms[user.id];
  // you are now nameless and without room/board
  user.name = undefined;
  user.room = undefined;
};

module.exports = {
  addUserToRoom,
  leaveRoom,
  getRoomTurn,
  getUsersInRoom,
};
