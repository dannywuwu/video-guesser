// room room!
type Room = {
  rName: string;
  users: Users;
  turn: number;
  phase: string;
  chooser?: User;
};

// maps room id to Room object
type Rooms = Record<string, Room>;


const roomFactory = (rName: string, users: Users, turn: number, phase: string, chooser: any) => {
  return {
    rName: rName,
    users: users,
    turn: turn,
    phase: phase,
    chooser: chooser
  };
};

const addUserToRoom = (rooms: Rooms, rName: string, user: User): Room => {
  const uid = user.id;
  // if rName exists, add user
  if (rooms[rName]) {
    rooms[rName] = {
      ...rooms[rName],
      users: { ...rooms[rName].users, [uid]: user },
    };
  } else {
    // new rName containing only user starting at turn 0
    rooms[rName] = roomFactory(
      rName,
      {
        [uid]: user,
      },
      0,
      "search",
      undefined,
    );
  }
  // mutate user
  user.room = rName;
  // position starts at 0
  user.position = Object.keys(getUsersInRoom(rooms, rName)).length - 1;
  return rooms[rName]
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
  console.log(`deleted ${user.name} from ${room.rName}`)
  // you are now nameless and without room/board
  user.name = undefined;
  user.room = undefined;
};

const deleteRoom = (room: Room, rooms: Rooms): Rooms => {
  delete rooms[room.rName]
  return rooms
}

const leaveRoomBig = (user: User, users: Users, room: Room, rooms: Rooms, uid: string, io: any): void => {
  console.log(room, room.users)
  console.log(Object.keys(room.users).length, Object.keys(room.users).length === 0)
  leaveRoom(user, rooms);
  console.log("remaining users", room.users)
  if (Object.keys(room.users).length === 0) {
    const updatedRooms = deleteRoom(room, rooms)
    console.log("deleted room", updatedRooms)
  } else {
    // rerender user display
    io.to(room).emit("display-users", getUsersInRoom(rooms, room.rName));
  }
}



module.exports = {
  addUserToRoom,
  leaveRoom,
  getRoomTurn,
  getUsersInRoom,
  deleteRoom,
  leaveRoomBig
};
