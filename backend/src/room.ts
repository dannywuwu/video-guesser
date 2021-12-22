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
  console.log("addUserToRoom", rooms[room]);
  if (rooms[room]) {
    rooms[room] = {
      ...rooms[room],
      users: { ...rooms[room].users, [uid]: user },
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
  //
  // console.log("addUserToRoom", rooms)
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
  // delete yourself from the room
  if (!user.room) {
    return;
  }

  const room = rooms[user.room];
  const users = room.users;
  delete users[user.id]
  console.log(`deleted ${user.name} from ${room}`)
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
